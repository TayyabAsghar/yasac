"use client";

import { z } from "zod";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentValidation } from "@/lib/validations/comment";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

import { addCommentToThread } from "@/lib/actions/thread.actions";

type Props = {
    threadId: string;
    currentUserImg: string;
    currentUserId: string;
};

export default function Comment(commentData: Props) {
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: { thread: '' }
    });

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToThread(
            commentData.threadId,
            values.thread,
            JSON.parse(commentData.currentUserId),
            pathname
        );

        form.reset();
    };

    return (
        <Form {...form}>
            <form className='comment-form' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField control={form.control} name='thread' render={({ field }) => (
                    <FormItem className='flex w-full items-center gap-3'>
                        <FormLabel>
                            <Image src={commentData.currentUserImg} alt='Current User' width={48} height={48}
                                className='rounded-full object-cover' />
                        </FormLabel>
                        <FormControl className='border-none bg-transparent'>
                            <Input type='text' {...field} placeholder='Comment...'
                                className='no-focus text-light-1 outline-none' />
                        </FormControl>
                    </FormItem>
                )} />

                <Button type='submit' className='comment-form-btn'>Reply</Button>
            </form>
        </Form>
    );
}
