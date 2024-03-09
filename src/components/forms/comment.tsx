'use client';

import { z } from 'zod';
import Image from 'next/image';
import { useState } from 'react';
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

const Comment = (prop: Props) => {
    const pathname = usePathname();
    const [disabled, setDisabled] = useState(true);

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: { thread: '' }
    });

    const changeInput = (event: React.KeyboardEvent<HTMLInputElement> & { target: HTMLInputElement; }) => {
        form.setValue('thread', event.target.value);
        setDisabled(event.target.value === '');
    };

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToThread(prop.threadId, values.thread, prop.currentUserId, prop.communityId, pathname);

        form.reset();
    };

    return (
        <Form {...form}>
            <form className='comment-form' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField control={form.control} name='thread' render={({ field }) => (
                    <FormItem className='flex w-full items-center gap-3'>
                        <FormLabel>
                            <Image src={prop.currentUserImg} alt='User Profile' title='User Profile' width={48} height={48}
                                className='rounded-full object-cover' />
                        </FormLabel>
                        <FormControl className='border-none bg-transparent'>
                            <Input type='text' {...field} placeholder='Comment...' onChange={changeInput}
                                className='no-focus text-light-1 outline-none' />
                        </FormControl>
                    </FormItem>
                )} />

                <Button type='submit' className='comment-form-btn' disabled={disabled}>Reply</Button>
            </form>
        </Form>
    );
};

export default Comment;
