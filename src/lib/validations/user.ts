import * as z from 'zod';

export const UserValidations = z.object({
    profilePhoto: z.string().url().min(1),
    name: z.string()
        .min(3, { message: 'Minimum 3 characters.' })
        .max(30, { message: 'Maximum 30 characters.' }),
    username: z.string()
        .min(3, { message: 'Minimum 3 characters.' })
        .max(30, { message: 'Maximum 30 characters.' })
        .regex(/^(?![0-9_])[a-zA-Z0-9_]+$/, 'Only alpha numeric or _ is allowed & start with alpha.'),
    email: z.string()
        .min(1, { message: 'Required field.' })
        .email("Please enter valid Email!"),
    bio: z.string()
        .min(3, { message: 'Minimum 3 characters.' })
        .max(1000, { message: 'Maximum 1000 characters.' }),
    private: z.boolean().default(false)
});
