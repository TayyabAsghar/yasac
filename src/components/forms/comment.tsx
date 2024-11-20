'use client';

import { z } from 'zod';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { CommentValidation } from '@/lib/validations/comment';
import { addCommentToThread } from '@/lib/actions/thread.actions';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

type Props = {
    threadId: string;
    communityId: string;
    currentUserId: string;
    currentUserImg: string;
};

const Comment = ({ threadId, communityId, currentUserId, currentUserImg }: Props) => {
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: { thread: '' },
    });

    // Watch the form input value
    const commentText = form.watch('thread');

    // Handle form submission
    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        try {
            await addCommentToThread(threadId, values.thread, currentUserId, communityId, pathname);
            form.reset();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <Form {...form}>
            <form className="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField control={form.control} name="thread" render={({ field }) => (
                    <FormItem className="flex w-full items-center gap-3">

                        <FormLabel>
                            <Image src={currentUserImg} className="rounded-full object-cover"
                                alt="User Profile" title="User Profile" width={48} height={48} />
                        </FormLabel>

                        <FormControl className="border-none bg-transparent">
                            <Input type="text" {...field} placeholder="Comment..."
                                className="no-focus text-light-1 outline-none"
                                aria-label="Write a comment"
                            />
                        </FormControl>
                    </FormItem>
                )} />

                <Button type="submit" className="comment-form-btn" disabled={!commentText?.trim()} >
                    Reply
                </Button>
            </form>
        </Form>
    );
};

export default Comment;
