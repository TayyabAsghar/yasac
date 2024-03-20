'use server';

import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import Community from '../models/community.model';
import { ThreadData } from '@/core/types/thread-data';
import { FilterQuery, Types, startSession } from 'mongoose';

export async function fetchThread(userId: string, pageNumber = 1, pageSize = 20) {
    try {
        connectToDB();

        // Calculate the number of posts to skip based on the page number and page size.
        const skipAmount = (pageNumber - 1) * pageSize;

        const user = await User.findOne({ _id: userId }).select('following');

        // find the users that are not followed by user but are not private.
        const publicUsers = await User.find({ _id: { $nin: [user.following, userId] }, private: false }).select('_id');

        const query: FilterQuery<typeof User> = {
            parentId: { $in: [null, undefined] }, // Query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply)
            author: { $in: [user.following, ...publicUsers.map(user => user._id.toString()), userId] }
        };

        const postsQuery = Thread.find(query).sort({ createdAt: 'desc' })
            .skip(skipAmount).limit(pageSize)
            .populate({
                path: 'author',
                model: User
            }).populate({
                path: 'community',
                model: Community
            }).populate({
                path: 'children', // Populate the children field
                populate: {
                    path: 'author', // Populate the author field within children
                    model: User,
                    select: '_id name parentId image username'
                }
            });

        const [totalPostsCount, postList] = await Promise.all([
            Thread.countDocuments(query), // Get the total count of posts
            postsQuery.exec()
        ]);

        const posts = postList.map(post => ({
            ...post._doc,
            likesCount: post.likes.length,
            isLiked: post.likes.some((like: { _id: { toString: () => any; }; }) => like._id.toString() === userId.toString())
        }));

        const isNext = totalPostsCount > skipAmount + posts.length;

        return { posts, isNext };
    } catch (error: any) {
        throw new Error(`Failed to fetch thread: ${error.message}`);
    }
}

export async function createThread(thread: ThreadData) {
    const session = await startSession();

    try {
        connectToDB();

        session.startTransaction();

        const communityIdObject = await Community.findOne(
            { id: thread.communityId },
            { _id: 1 }
        );

        const createdThread = await Thread.create({
            text: thread.text,
            author: thread.author,
            community: communityIdObject // Assign communityId if provided, or leave it null for personal account
        });

        // Update User and Community models concurrently
        const updatePromises = [
            User.findByIdAndUpdate(thread.author, {
                $push: { threads: createdThread._id },
            }),
            communityIdObject && Community.findByIdAndUpdate(communityIdObject, {
                $push: { threads: createdThread._id }
            })
        ];

        await Promise.all(updatePromises);
        await session.commitTransaction();

        revalidatePath(thread.path);
    } catch (error: any) {
        if (session.inTransaction()) await session.abortTransaction();
        throw new Error(`Failed to create thread: ${error.message}`);
    } finally {
        session.endSession();
    }
}

async function fetchAllChildThreads(threadId: string): Promise<{ descendantThreadId: string, author: string, community: string; }[]> {
    const threads = await Thread.aggregate([
        { $match: { _id: new Types.ObjectId(threadId) } },
        {
            $graphLookup: {
                from: 'threads',
                startWith: '$_id',
                connectFromField: '_id',
                connectToField: 'parentId',
                as: 'descendants',
                depthField: 'level', // Track depth to prevent infinite loops
                maxDepth: 100, // Set a maximum depth for safety
            }
        },
        { $unwind: '$descendants' }, // Unwind descendant threads
        { $project: { _id: 0, descendantThreadId: '$descendants._id', author: '$descendants.author', community: '$descendants.community' } }
    ]);
    return threads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
    const session = await startSession();

    try {
        connectToDB();

        session.startTransaction();

        // Find the thread to be deleted (the main thread)
        const mainThread = await Thread.findById(id).populate('author community');

        if (!mainThread) throw new Error('Thread not found');

        // Fetch all child threads and their descendants recursively
        const descendantThreads = await fetchAllChildThreads(id);

        // Get all descendant thread IDs including the main thread ID and child thread IDs
        const descendantThreadIds = [
            id,
            ...descendantThreads.map(thread => thread.descendantThreadId.toString()),
        ];

        // Extract the authorIds and communityIds to update User and Community models respectively
        const uniqueAuthorIds = new Set<string>([
            ...descendantThreads.flatMap(thread => thread.author ? [thread.author.toString()] : []),
            ... (mainThread.author?._id ? [mainThread.author._id.toString()] : []),
        ]);

        const uniqueCommunityIds = new Set<string>([
            ...descendantThreads.flatMap(thread => thread.community ? [thread.community.toString()] : []),
            ... (mainThread.community?._id ? [mainThread.community._id.toString()] : []),
        ]);

        // Delete threads and update User and Community models concurrently
        const deleteAndUpdatePromises = [
            Thread.deleteMany({ _id: { $in: descendantThreadIds } }),
            User.updateMany(
                { _id: { $in: Array.from(uniqueAuthorIds) } },
                { $pull: { threads: { $in: descendantThreadIds } } }
            ),
            Community.updateMany(
                { _id: { $in: Array.from(uniqueCommunityIds) } },
                { $pull: { threads: { $in: descendantThreadIds } } }
            )
        ];

        await Promise.all(deleteAndUpdatePromises);
        await session.commitTransaction();

        revalidatePath(path);
    } catch (error: any) {
        if (session.inTransaction()) await session.abortTransaction();
        throw new Error(`Failed to delete thread: ${error.message}`);
    } finally {
        session.endSession();
    }
}

export async function fetchThreadById(threadId: string, userId: string) {
    try {
        connectToDB();

        const threadData = await Thread.findById(threadId)
            .populate({
                path: 'author',
                model: User,
                select: '_id id name image username',
            }).populate({  // Populate the author field with _id and username
                path: 'community',
                model: Community,
                select: '_id id name image',
            }).populate({
                path: 'children', // Populate the children field
                populate: [{
                    path: 'author', // Populate the author field within children
                    model: User,
                    select: '_id id name parentId image username' // Select only _id and username fields of the author
                }, {
                    path: 'children', // Populate the children field within children
                    model: Thread, // The model of the nested children (assuming it's the same 'Thread' model)
                    populate: {
                        path: 'author', // Populate the author field within nested children
                        model: User,
                        select: '_id id name parentId image username' // Select only _id and username fields of the author
                    }
                }, {
                    path: 'community',
                    model: Community,
                    select: '_id name image'
                }]
            });

        const thread = {
            ...threadData._doc,
            children: threadData.children.map((child: { _doc: any; likes: { _id: { toString: () => string; }; }[]; }) => ({
                ...child._doc,
                likesCount: child.likes.length,
                isLiked: child.likes.some((like: { _id: { toString: () => string; }; }) => like._id.toString() === userId.toString()),
            })),
            likesCount: threadData.likes.length,
            isLiked: threadData.likes.some((like: { _id: { toString: () => string; }; }) => like._id.toString() === userId.toString()),
        };

        return thread;
    } catch (error: any) {
        throw new Error(`Unable to fetch thread: ${error.message}`);
    }
}

export async function fetchCommunityThreadsCount(communityId: string) {
    try {
        connectToDB();

        return await Thread.countDocuments({ community: communityId, parentId: { $in: [null, undefined] } });
    } catch (error: any) {
        throw new Error(`Error fetching community threads count: ${error.message}`);
    }
}

export async function fetchUserThreadsCount(userId: string) {
    try {
        connectToDB();

        return await Thread.countDocuments({ author: userId, parentId: { $in: [null, undefined] } });
    } catch (error: any) {
        throw new Error(`Error fetching user threads count: ${error.message}`);
    }
}

export async function addCommentToThread(threadId: string, commentText: string, userId: string, communityId: string, path: string) {
    try {
        connectToDB();

        // Find the original thread by its ID
        const originalThread = await Thread.findById(threadId);

        if (!originalThread) throw new Error('Thread not found');

        // Create the new comment thread
        const commentThread = new Thread({
            author: userId,
            text: commentText,
            parentId: threadId,
            community: communityId
        });

        // Save the comment thread to the database
        const savedCommentThread = await commentThread.save();

        // Update the original thread in the database
        let promises = [Thread.findByIdAndUpdate(threadId, { $push: { children: savedCommentThread._id } })];

        if (communityId)
            promises.push(Community.findByIdAndUpdate(communityId, { $push: { threads: savedCommentThread._id } }));

        await Promise.all(promises);

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error while adding comment: ${error.message}`);
    }
}

export async function likeThread(threadId: string, userId: string) {
    try {
        connectToDB();
        await Thread.updateOne(
            { _id: threadId, likes: { $ne: userId } },
            { $addToSet: { likes: userId } }
        );
    } catch (error: any) {
        throw new Error(`Error while liking thread: ${error.message}`);
    }
}

export async function removeLike(threadId: string, userId: string) {
    try {
        connectToDB();
        await Thread.updateOne(
            { _id: threadId },
            { $pull: { likes: userId } }
        );
    } catch (error: any) {
        throw new Error(`Error while liking thread: ${error.message}`);
    }
}
