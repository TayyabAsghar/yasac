'use server';

import { FilterQuery } from 'mongoose';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import Thread from '../models/thread.model';
import Community from '../models/community.model';
import { ThreadsObject } from '@/core/types/thread-data';
import { CommunityData, CommunityListOptions } from '@/core/types/community-data';

export async function createCommunity(communityData: CommunityData) {
    try {
        connectToDB();

        // Find the user with the provided unique id
        const user = await User.findOne({ id: communityData.createdById });

        if (!user) throw new Error('User not found'); // Handle the case if the user with the id is not found

        const newCommunity = new Community({
            id: communityData.id,
            name: communityData.name,
            username: communityData.username,
            image: communityData.image,
            bio: communityData.bio,
            createdBy: user._id
        });

        const createdCommunity = await newCommunity.save();

        // Update User model
        user.communities.push(createdCommunity._id);
        await user.save();

        return createdCommunity;
    } catch (error: any) {
        throw new Error(`Error creating community: ${error.message}`);
    }
}


export async function fetchCommunityDetails(id: string) {
    try {
        connectToDB();

        const communityDetails = await Community.findOne({ id }).populate(['createdBy', {
            path: 'members',
            model: User,
            select: 'name username image _id id',
        }]);

        return communityDetails;
    } catch (error: any) {
        throw new Error(`Error fetching community details: ${error.message}`);
    }
}

export async function fetchCommunityThreads(id: string): Promise<ThreadsObject> {
    try {
        connectToDB();

        const communityPosts = await Community.findById(id).populate({
            path: 'threads',
            model: Thread,
            populate: [{
                path: 'author',
                model: User,
                select: 'name image id' // Select the 'name' and '_id' fields from the 'User' model
            }, {
                path: 'children',
                model: Thread,
                populate: {
                    path: 'author',
                    model: User,
                    select: 'image _id' // Select the 'name' and '_id' fields from the 'User' model
                }
            }]
        });

        return communityPosts;
    } catch (error: any) {
        throw new Error(`Error fetching community posts: ${error.message}`);
    }
}

export async function fetchCommunities(options: CommunityListOptions) {
    try {
        connectToDB();

        // Calculate the number of communities to skip based on the page number and page size.
        const skipAmount = (options.pageNumber - 1) * options.pageSize;

        // Create a case-insensitive regular expression for the provided search string.
        const regex = new RegExp(options.searchString, 'i');

        // Create an initial query object to filter communities.
        const query: FilterQuery<typeof Community> = {};

        // If the search string is not empty, add the $or operator to match either username or name fields.
        if (options.searchString.trim() !== '') {
            query.$or = [
                { username: { $regex: regex } },
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

export async function addMemberToCommunity(communityId: string, memberId: string) {
    try {
        connectToDB();

        // Find the community by its unique id
        const community = await Community.findOne({ id: communityId });

        if (!community) {
            throw new Error('Community not found');
        }

        // Find the user by their unique id
        const user = await User.findOne({ id: memberId });

        if (!user) {
            throw new Error('User not found');
        }

        // Check if the user is already a member of the community
        if (community.members.includes(user._id)) {
            throw new Error('User is already a member of the community');
        }

        // Add the user's _id to the members array in the community
        community.members.push(user._id);
        await community.save();

        // Add the community's _id to the communities array in the user
        user.communities.push(community._id);
        await user.save();

        return community;
    } catch (error: any) {
        throw new Error(`Error adding member to community: ${error.message}`);
    }
}

export async function removeUserFromCommunity(userId: string, communityId: string) {
    try {
        connectToDB();

        const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
        const communityIdObject = await Community.findOne(
            { id: communityId },
            { _id: 1 }
        );

        if (!userIdObject) throw new Error('User not found');

        if (!communityIdObject) throw new Error('Community not found');

        // Remove the user's _id from the members array in the community
        await Community.updateOne(
            { _id: communityIdObject._id },
            { $pull: { members: userIdObject._id } }
        );

        // Remove the community's _id from the communities array in the user
        await User.updateOne(
            { _id: userIdObject._id },
            { $pull: { communities: communityIdObject._id } }
        );

        return { success: true };
    } catch (error: any) {
        throw new Error(`Error removing user from community: ${error.message}`);
    }
}

export async function updateCommunityInfo(communityId: string, name: string, username: string, image: string) {
    try {
        connectToDB();

        // Find the community by its _id and update the information
        const updatedCommunity = await Community.findOneAndUpdate(
            { id: communityId },
            { name, username, image }
        );

        if (!updatedCommunity) {
            throw new Error('Community not found');
        }

        return updatedCommunity;
    } catch (error: any) {
        throw new Error(`Error updating community information: ${error.message}`);
    }
}

export async function deleteCommunity(communityId: string) {
    try {
        connectToDB();

        // Find the community by its ID and delete it
        const deletedCommunity = await Community.findOneAndDelete({
            id: communityId,
        });

        if (!deletedCommunity) {
            throw new Error('Community not found');
        }

        // Delete all threads associated with the community
        await Thread.deleteMany({ community: communityId });

        // Find all users who are part of the community
        const communityUsers = await User.find({ communities: communityId });

        // Remove the community from the 'communities' array for each user
        const updateUserPromises = communityUsers.map(user => {
            user.communities.pull(communityId);
            return user.save();
        });

        await Promise.all(updateUserPromises);

        return deletedCommunity;
    } catch (error: any) {
        throw new Error(`Error deleting community: ${error.message}`);
    }
}
