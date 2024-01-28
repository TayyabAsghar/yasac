import * as z from 'zod';

export const ThreadValidations = z.object({
    thread: z.string().min(1),
    accountId: z.string()
});
