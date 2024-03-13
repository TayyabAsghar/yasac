import * as z from 'zod';

export const ThreadValidations = z.object({
    thread: z.string().trim().min(1),
    accountId: z.string()
});
