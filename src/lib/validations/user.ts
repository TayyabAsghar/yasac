import * as z from 'zod';

export const UserValidations = z.object({
    profilePhoto: z.string().url().min(1),
    name: z.string()
        .min(3, { message: "Minimum 3 characters." })
        .max(30, { message: "Maximum 30 characters." }),
    username: z.string()
        .min(3, { message: "Minimum 3 characters." })
        .max(30, { message: "Maximum 30 characters." }),
    bio: z.string()
        .min(3, { message: "Minimum 3 characters." })
        .max(1000, { message: "Maximum 1000 characters." })
});
