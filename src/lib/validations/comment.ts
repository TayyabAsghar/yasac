import * as z from 'zod';

export const CommentValidation = z.object({
    thread: z.string().trim().min(1),
});
