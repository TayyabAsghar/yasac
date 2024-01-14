'use server';

import { FilterQuery } from 'mongoose';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import { DBUserData, UserListOptions } from '@/core/types/user-data';

export async function fetchUser(userId: string) {
    try {
        connectToDB();

        return await User.findOne({ id: userId }).populate({
            path: 'communities',
            // model: Community,
        });
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}

export async function updateUser(user: DBUserData): Promise<void> {
    try {
        connectToDB();

        await User.findOneAndUpdate(
            { id: user.userId },
            {
                bio: user.bio,
                name: user.name,
                onboarded: true,
                image: user.image,
                username: user.username.toLowerCase()
            },
            { upsert: true }
        );

        if (user.path === '/profile/edit') {
            revalidatePath(user.path);
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`);
    }
}

export async function fetchUserThreads(userId: string) {
    try {
        connectToDB();

        // Find all threads authored by the user with the given userId
        const threads = await User.findOne({ id: userId }).populate({
            path: 'threads',
            model: Thread,
            populate: [{
                path: 'community',
                model: Community,
                select: 'name id image _id', // Select the 'name' and '_id' fields from the 'Community' model
            }, {
                path: 'children',
                model: Thread,
                populate: {
                    path: 'author',
                    model: User,
                    select: 'name image id', // Select the 'name' and '_id' fields from the 'User' model
                }
            }]
        });
        return threads;
    } catch (error: any) {
        throw new Error(`Error fetching user threads: ${error.message}`);
    }
}

export async function fetchUsers(options: UserListOptions) {
    try {
        connectToDB();

        // Calculate the number of users to skip based on the page number and page size.
        const skipAmount = (options.pageNumber - 1) * options.pageSize;

        // Create a case-insensitive regular expression for the provided search string.
        const regex = new RegExp(options.searchString, 'i');

        // Create an initial query object to filter users.
        const query: FilterQuery<typeof User> = {
            id: { $ne: options.userId } // Exclude the current user from the results.
        };

        // If the search string is not empty, add the $or operator to match either username or name fields.
        if (options.searchString.trim() !== '') {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ];
        }

        // Define the sort options for the fetched users based on createdAt field and provided sort order.
        const sortOptions = { createdAt: options.sortBy };

        const usersQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(options.pageSize);

        // Count the total number of users that match the search criteria (without pagination).
        const totalUsersCount = await User.countDocuments(query);

        const users = await usersQuery.exec();

        // Check if there are more users beyond the current page.
        const isNext = totalUsersCount > skipAmount + users.length;

        return { users, isNext };
    } catch (error: any) {
        throw new Error(`Error fetching users: ${error.message}`);
    }
}

export async function getActivity(userId: string) {
    try {
        connectToDB();

        // Find all threads created by the user
        const userThreads = await Thread.find({ author: userId });

        // Collect all the child thread ids (replies) from the 'children' field of each user thread
        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children);
        }, []);

        // Find and return the child threads (replies) excluding the ones created by the same user
        const replies = await Thread.find({
            _id: { $in: childThreadIds },
            author: { $ne: userId }, // Exclude threads authored by the same user
        }).populate({
            path: 'author',
            model: User,
            select: 'name image _id',
        });

        return replies;
    } catch (error: any) {
        throw new Error(`Error fetching replies: ${error.message}`);
    }
}

