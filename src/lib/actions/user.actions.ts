'use server';

import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import { DBUserData } from '@/core/types/user-data';

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
    } catch (error) {
        console.error('Error fetching user threads:', error);
        throw error;
    }
}
