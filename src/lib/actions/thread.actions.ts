'use server';

import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import { Types, startSession } from 'mongoose';
import Community from '../models/community.model';
import { ThreadData } from '@/core/types/thread-data';

export async function fetchThread(userId: string, pageNumber = 1, pageSize = 20) {
    try {
        connectToDB();

        // Calculate the number of posts to skip based on the page number and page size.
        const skipAmount = (pageNumber - 1) * pageSize;

        // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
        const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } }).sort({ createdAt: 'desc' })
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
                    select: '_id name parentId image'
                }
            }).populate({
                path: 'likes', // Populate the likes field
                model: User,
                select: '_id' // Select only _id field of the user
            });

        // Count the total number of top-level posts (threads) i.e., threads that are not comments.
        const totalPostsCount = await Thread.countDocuments({
            parentId: { $in: [null, undefined] }
        }); // Get the total count of posts

        const postList = await postsQuery.exec();

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

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
    const threads = await Thread.aggregate([{
        $match: { _id: new Types.ObjectId(threadId) }
    }, {
        $graphLookup: {
            from: 'threads',
            startWith: '$_id',
            connectFromField: '_id',
            connectToField: 'parentId',
            as: 'descendantThreads'
        }
    }, {
        $unwind: '$descendantThreads'
    }, {
        $sort: { 'descendantThreads.createdAt': -1 }
    }, {
        $group: {
            _id: '$_id',
            descendantThreads: { $push: '$descendantThreads' }
        }
    }]);

    return threads[0].descendantThreads;
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
            ...descendantThreads.map((thread) => thread._id),
        ];

        // Extract the authorIds and communityIds to update User and Community models respectively
        const uniqueAuthorIds = new Set(
            [
                ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
                mainThread.author?._id?.toString(),
            ].filter((id) => id !== undefined)
        );

        const uniqueCommunityIds = new Set(
            [
                ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
                mainThread.community?._id?.toString(),
            ].filter((id) => id !== undefined)
        );

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
                select: '_id id name image',
            }).populate({  // Populate the author field with _id and username
                path: 'community',
                // model: Community,
                select: '_id id name image',
            }).populate({ // Populate the community field with _id and name
                path: 'children', // Populate the children field
                populate: [{
                    path: 'author', // Populate the author field within children
                    model: User,
                    select: '_id id name parentId image' // Select only _id and username fields of the author
                }, {
                    path: 'children', // Populate the children field within children
                    model: Thread, // The model of the nested children (assuming it's the same 'Thread' model)
                    populate: {
                        path: 'author', // Populate the author field within nested children
                        model: User,
                        select: '_id id name parentId image' // Select only _id and username fields of the author
                    }
                }]
            }).populate({
                path: 'likes', // Populate the likes field
                model: User,
                select: '_id' // Select only _id field of the user
            });

        const thread = {
            ...threadData._doc,
            likesCount: threadData.likes.length,
            isLiked: threadData.likes.some((like: { _id: { toString: () => string; }; }) => like._id.toString() === userId.toString()),
        };

        return thread;
    } catch (error: any) {
        throw new Error(`Unable to fetch thread: ${error.message}`);
    }
}

export async function addCommentToThread(threadId: string, commentText: string, userId: string, path: string) {
    try {
        connectToDB();

        // Find the original thread by its ID
        const originalThread = await Thread.findById(threadId);

        if (!originalThread) throw new Error('Thread not found');

        // Create the new comment thread
        const commentThread = new Thread({ text: commentText, author: userId, parentId: threadId, likes: [userId] });

        // Save the comment thread to the database
        const savedCommentThread = await commentThread.save();

        // Update the original thread in the database
        await Thread.findByIdAndUpdate(threadId, { $push: { children: savedCommentThread._id } });

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
