import * as z from 'zod';
import { AcceptedImageTypes, UploadImagesSizeLimit } from '../constants';

export const ThreadValidations = z.object({
    thread: z.string().trim().min(1, { message: "Post must contains at least 1 character." }),
    accountId: z.string(),
    threadImage: z.custom<File>()
        .refine(file => AcceptedImageTypes.includes(file.type), "Only .jpeg, .jpg, webp and .png is accepted.")
        .refine(file => file.size < UploadImagesSizeLimit, `Image size should be smaller than ${UploadImagesSizeLimit / (2 ** 20)} Mb's.`)
        .optional()
});
