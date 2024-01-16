import * as z from 'zod';

export const ThreadValidations = z.object({
    thread: z.string().min(3, { message: 'Minimum 3 characters.' }),
    accountId: z.string()
});
