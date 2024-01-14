"use server";

import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import { DBUserData } from '@/core/types/user-data';

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

        if (user.path === "/profile/edit") {
            revalidatePath(user.path);
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`);
    }
}
