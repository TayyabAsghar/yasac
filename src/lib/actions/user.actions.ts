'use server';

import User from '@/lib/models/user.model';
import { connectToDB } from '@/lib/mongoose';
import { revalidatePath } from 'next/cache';
import Thread from '@/lib/models/thread.model';
import Community from '@/lib/models/community.model';
import { FilterQuery, startSession } from 'mongoose';
import { DBUserData, UserListOptions } from '@/core/types/user-data';

function simplifyUserObject(userObject: any) {
    return {
        id: userObject.id,
        bio: userObject.bio,
        name: userObject.name,
        email: userObject.email,
        image: userObject.image,
        private: userObject.private,
        username: userObject.username,
        onboarded: userObject.onboarded,
        _id: userObject._id.toString(),
        threads: userObject.threads.map((id: any) => id.toString()),
        following: userObject.following.map((id: any) => id.toString()),
        followers: userObject.followers.map((id: any) => id.toString()),
        communities: userObject.communities.map((id: any) => id.toString())
    };
}

export async function fetchUser(userId: string): Promise<any> {
    try {
        connectToDB();

        return simplifyUserObject(await User.findOne({ id: userId }));
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}

export async function fetchUserByUsername(username: string): Promise<any> {
    try {
        connectToDB();

        return simplifyUserObject(await User.findOne({ username: username }));
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
                private: user.private,
                email: user.email,
                username: user.username.toLowerCase()
            },
            { upsert: true }
        );

        if (user.path === '/profile/edit') revalidatePath(user.path);
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`);
    }
}

export async function fetchUserThreads(userId: string): Promise<any> {
    try {
        connectToDB();

        // Find all threads authored by the user with the given userId
        return await User.findOne({ _id: userId }).populate({
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
                    select: 'name image id username', // Select the 'name' and '_id' fields from the 'User' model
                }
            }]
        });
    } catch (error: any) {
        throw new Error(`Error fetching user threads: ${error.message}`);
    }
}

export async function isPrivateUser(userId: string): Promise<boolean> {
    try {
        connectToDB();

        const user = await User.findOne({ _id: userId });
        return user.private;
    } catch (error: any) {
        throw new Error(`Error fetching user threads: ${error.message}`);
    }
}

export async function fetchUsers(options: UserListOptions): Promise<{ users: any[]; isNext: boolean; }> {
    try {
        connectToDB();

        // Calculate the number of users to skip based on the page number and page size.
        const skipAmount = (options.pageNumber - 1) * options.pageSize;

        // Create a case-insensitive regular expression for the provided search string.
        const regex = new RegExp(options?.searchString ?? '', 'i');

        // Create an initial query object to filter users.
        const query: FilterQuery<typeof User> = {
            _id: { $ne: options.userId }, // Exclude the current user from the results.
            ...(options.removeFollowed && { followers: { $ne: options.userId } }) // Exclude if user is already being followed.
        };

        // If the search string is not empty, add the $or operator to match either username or name fields.
        if (options?.searchString?.trim() !== '') {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ];
        }

        // Define the sort options for the fetched users based on createdAt field and provided sort order.
        const sortOptions = { createdAt: options.sortBy };

        const usersQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(options.pageSize);

        const [totalUsersCount, users] = await Promise.all([
            User.countDocuments(query),
            usersQuery.exec()
        ]);

        // Check if there are more users beyond the current page.
        const isNext = totalUsersCount > skipAmount + users.length;

        return { users, isNext };
    } catch (error: any) {
        throw new Error(`Error fetching users: ${error.message}`);
    }
}

export async function fetchFollowersList(options: UserListOptions): Promise<{ users: any[]; isNext: boolean; }> {
    try {
        connectToDB();

        // Calculate the number of users to skip based on the page number and page size.
        const skipAmount = (options.pageNumber - 1) * options.pageSize;

        // Create an initial query object to filter users.
        const query: FilterQuery<typeof User> = {
            _id: { $ne: options.userId }, // Exclude the current user from the results.
            followers: { $in: options.userId } // Include if user is being followed.
        };

        // Define the sort options for the fetched users based on createdAt field and provided sort order.
        const sortOptions = { createdAt: options.sortBy };

        const usersQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(options.pageSize);

        const [totalUsersCount, users] = await Promise.all([
            User.countDocuments(query),
            usersQuery.exec()
        ]);

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
            select: 'name image _id username',
        });

        return replies;
    } catch (error: any) {
        throw new Error(`Error fetching replies: ${error.message}`);
    }
}

export async function isUserAFollower(userId: string, currentUserId: string): Promise<boolean> {
    try {
        connectToDB();

        const follower = await User.exists({ _id: userId, followers: currentUserId });
        return follower !== null;
    } catch (error: any) {
        throw new Error(`Error fetching is following: ${error.message}`);
    }
};

export async function followUser(userId: string, currentUserId: string, path: string): Promise<void> {
    const session = await startSession();

    try {
        session.startTransaction();
        connectToDB();

        const userUpdate1 = User.updateOne(
            { _id: userId, followers: { $ne: currentUserId } },
            { $addToSet: { followers: currentUserId } },
            { session }
        );

        const userUpdate2 = await User.updateOne(
            { _id: currentUserId, following: { $ne: userId } },
            { $addToSet: { following: userId } },
            { session }
        );

        await Promise.all([userUpdate1, userUpdate2]);
        await session.commitTransaction();
        revalidatePath(path);
    } catch (error: any) {
        if (session.inTransaction()) await session.abortTransaction();
        throw new Error(`Error following the user: ${error.message}`);
    } finally {
        session.endSession();
    }
};

export async function unFollowUser(userId: string, currentUserId: string, path: string): Promise<void> {
    const session = await startSession();

    try {
        session.startTransaction();
        connectToDB();

        const userUpdate1 = User.updateOne(
            { _id: userId },
            { $pull: { followers: currentUserId } },
            { session }
        );

        const userUpdate2 = await User.updateOne(
            { _id: currentUserId },
            { $pull: { following: userId } },
            { session }
        );

        await Promise.all([userUpdate1, userUpdate2]);
        await session.commitTransaction();
        revalidatePath(path);
    } catch (error: any) {
        if (session.inTransaction()) await session.abortTransaction();
        throw new Error(`Error unFollowing the user: ${error.message}`);
    } finally {
        session.endSession();
    }
};

export async function getSocialCount(userId: string): Promise<{ followersCount: number; followingCount: number; }> {
    try {
        connectToDB();
        // Find the user by their ID
        const user = await User.findOne({ _id: userId });

        const followersCount: number = user.followers.length || 0;
        const followingCount: number = user.following.length || 0;

        return { followersCount, followingCount };
    } catch (error: any) {
        throw new Error(`Error fetching followers and following count: ${error.message}`);
    }
}
