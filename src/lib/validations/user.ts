import * as z from 'zod';
import { usernameExists } from '../actions/user.actions';

export function UserValidations(username: string) {
    return z.object({
        profilePhoto: z.string().url().min(1),
        name: z.string().trim().toLowerCase()
            .min(3, { message: 'Minimum 3 characters.' })
            .max(30, { message: 'Maximum 30 characters.' }),
        username: z.string().trim().toLowerCase()
            .min(3, { message: 'Minimum 3 characters.' })
            .max(30, { message: 'Maximum 30 characters.' })
            .regex(/^(?![0-9_])[a-zA-Z0-9_]+$/, 'Only alpha numeric or _ is allowed & start with alpha.')
            .refine(async (val) => {
                return val.toLowerCase() !== username.toLowerCase() ? !(await usernameExists(val.toLowerCase())) : true;
            }, 'Username already exists.'),
        email: z.string().trim().toLowerCase()
            .min(1, { message: 'Required field.' })
            .email("Please enter valid Email!"),
        bio: z.string().trim()
            .min(3, { message: 'Minimum 3 characters.' })
            .max(1000, { message: 'Maximum 1000 characters.' }),
        private: z.boolean().default(false)
    });
}
