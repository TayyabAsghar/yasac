'use server';

import User from '../models/user.model';
import { NextError } from '../next-error';
import { connectToDB } from '../mongoose';
import Thread from '../models/thread.model';
import Community from '../models/community.model';
import { FilterQuery, startSession } from 'mongoose';
import { ThreadsObject } from '@/core/types/thread-data';
import { CommunityData, CommunityListOptions } from '@/core/types/community-data';

export async function createCommunity(communityData: CommunityData) {
    try {
        connectToDB();

        // Find the user with the provided unique id
        const user = await User.findOne({ id: communityData.createdById });

        if (!user) throw new NextError('User not found', 404); // Handle the case if the user with the id is not found

        const newCommunity = new Community({
            id: communityData.id,
            name: communityData.name,
            slug: communityData.slug,
            image: communityData.image,
            bio: communityData.bio,
            createdBy: user._id
        });

        return await newCommunity.save();
    } catch (error: any) {
        throw new NextError(`Error creating community: ${error.message}`, 500);
    }
}

export async function fetchCommunityDetails(slug: string) {
    try {
        connectToDB();

        const communityDetails = await Community.findOne({ slug: slug }).populate(['createdBy', {
            path: 'members',
            model: User,
            select: 'name slug image _id id username',
        }]);

        return communityDetails;
    } catch (error: any) {
        throw new Error(`Error fetching community details: ${error.message}`);
    }
}

export async function getMembersAndPostCount(communityId: string): Promise<{ postsCount: number; membersCount: number; }> {
    try {
        connectToDB();

        // Find the community by its ID
        const community = await Community.findById(communityId);

        if (!community) throw new Error('Community not found');

        // Count the number of threads and members
        const postsCount = community.threads.length;
        const membersCount = community.members.length;

        return { postsCount, membersCount };
    } catch (error: any) {
        throw new Error(`Error fetching community details: ${error.message}`);
    }
};

export async function fetchCommunityThreads(id: string, userId: string): Promise<ThreadsObject> {
    try {
        connectToDB();

        const communityPostList = await Community.findOne({ _id: id }).populate({
            path: 'threads',
            model: Thread,
            options: {
                sort: { createdAt: -1 }
            },
            populate: [{
                path: 'author',
                model: User,
                select: 'name image _id username' // Select the 'name' and '_id' fields from the 'User' model
            }, {
                path: 'children',
                model: Thread,
                populate: {
                    path: 'author',
                    model: User,
                    select: 'name image _id username' // Select the 'image' and '_id' fields from the 'User' model
                }
            }]
        });

        const communityPosts = {
            ...communityPostList._doc,
            threads: communityPostList.threads.map((thread: { _doc: any; likes: { _id: { toString: () => any; }; }[]; }) => ({
                ...thread._doc,
                likesCount: thread.likes.length,
                isLiked: thread.likes.some((like: { _id: { toString: () => any; }; }) => like._id.toString() === userId.toString())
            }))
        };

        return communityPosts;
    } catch (error: any) {
        throw new Error(`Error fetching community posts: ${error.message}`);
    }
}

export async function fetchCommunities(options: CommunityListOptions): Promise<{ communities: any[]; isNext: boolean; }> {
    try {
        connectToDB();

        // Calculate the number of communities to skip based on the page number and page size.
        const skipAmount = (options.pageNumber - 1) * options.pageSize;

        // Create a case-insensitive regular expression for the provided search string.
        const regex = new RegExp(options.searchString, 'i');

        // Create an initial query object to filter communities.
        let query: FilterQuery<typeof Community.schema.obj> = {};

        if (options?.userId) query = { members: { $ne: options.userId } };

        // If the search string is not empty, add the $or operator to match either username or name fields.
        if (options.searchString.trim()) {
            query.$or = [
                { slug: { $regex: regex } },
                { name: { $regex: regex } },
            ];
        }

        // Define the sort options for the fetched communities based on createdAt field and provided sort order.
        const sortOptions = { createdAt: options.sortBy };

        // Create a query to fetch the communities based on the search and sort criteria.
        const communitiesQuery = Community.find(query).sort(sortOptions).skip(skipAmount)
            .limit(options.pageSize).populate('members');

        // Count the total number of communities that match the search criteria (without pagination).
        const totalCommunitiesCount = await Community.countDocuments(query);

        const communities = await communitiesQuery.exec();

        // Check if there are more communities beyond the current page.
        const isNext = totalCommunitiesCount > skipAmount + communities.length;

        return { communities, isNext };
    } catch (error: any) {
        throw new Error(`Error fetching communities: ${error.message}`);
    }
}

export async function addMemberToCommunity(communityId: string, email: string) {
    const session = await startSession();

    try {
        connectToDB();

        session.startTransaction();

        // Find the community and user by their unique ids concurrently
        const [user, community] = await Promise.all([
            User.findOne({ email: email }),
            Community.findOne({ id: communityId })
        ]);

        if (!user) throw new NextError('User not found', 404);
        if (!community) throw new NextError('Community not found', 404);

        // Check if the user is already a member of the community
        const includedInUser = user.communities.includes(community._id);
        const includedInCommunity = community.members.includes(user._id);

        if (includedInCommunity && includedInUser)
            throw new NextError('User is already a member of the community', 409);

        let promises = [];

        // Add the community's _id to the communities array in the user
        if (!includedInCommunity) {
            user.communities.push(community._id);
            promises.push(user.save());
        }

        // Add the user's _id to the members array in the community
        if (!includedInUser) {
            community.members.push(user._id);
            promises.push(community.save());
        }

        await Promise.all(promises);
        await session.commitTransaction();

        return community;
    } catch (error: any) {
        if (session.inTransaction()) await session.abortTransaction();
        throw new NextError(`Error adding member to community: ${error.message}`, error.statusCode);
    } finally {
        session.endSession();
    }
}

export async function removeUserFromCommunity(userId: string, communityId: string) {
    const session = await startSession();

    try {
        connectToDB();

        session.startTransaction();

        const [userIdObject, communityIdObject] = await Promise.all([
            User.findOne({ id: userId }, { _id: 1 }),
            Community.findOne({ id: communityId }, { _id: 1 }, { session })
        ]);

        if (!userIdObject) throw new NextError('User not found', 404);

        if (!communityIdObject) throw new NextError('Community not found', 404);

        await Promise.all([
            Community.updateOne(
                { _id: communityIdObject._id },
                { $pull: { members: userIdObject._id } },
                { session }
            ),
            User.updateOne(
                { _id: userIdObject._id },
                { $pull: { communities: communityIdObject._id } },
                { session }
            )
        ]);

        await session.commitTransaction();

        return { success: true };
    } catch (error: any) {
        if (session.inTransaction()) await session.abortTransaction();
        throw new NextError(`Error removing user from community: ${error.message}`, error.statusCode);
    } finally {
        session.endSession();
    }
}

export async function updateCommunityInfo(communityId: string, name: string, slug: string, image: string) {
    try {
        connectToDB();

        // Find the community by its _id and update the information
        const updatedCommunity = await Community.findOneAndUpdate(
            { id: communityId },
            { name, slug, image },
            { new: true }
        );

        if (!updatedCommunity) throw new NextError('Community not found', 404);

        return updatedCommunity;
    } catch (error: any) {
        throw new NextError(`Error updating community information: ${error.message}`, error.statusCode);
    }
}

export async function deleteCommunity(communityId: string) {
    const session = await startSession();

    try {
        connectToDB();

        session.startTransaction();
        // Find the community by its ID and delete it
        const deletedCommunity = await Community.findOneAndDelete({ id: communityId }, { session });

        if (!deletedCommunity) throw new NextError('Community not found', 404);

        await Promise.all([
            // Delete all threads associated with the community
            Thread.deleteMany({ community: deletedCommunity._id }, { session }),
            // Update all users who are part of the community in one go
            User.updateMany(
                { communities: deletedCommunity._id },
                { $pull: { communities: deletedCommunity._id } },
                { session }
            )
        ]);

        // Commit the transaction
        await session.commitTransaction();

        return deletedCommunity;
    } catch (error: any) {
        if (session.inTransaction()) await session.abortTransaction();
        throw new NextError(`Error deleting community: ${error.message}`, error.statusCode);
    } finally {
        session.endSession();
    }
}
