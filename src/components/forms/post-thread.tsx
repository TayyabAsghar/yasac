'use client';

import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOrganization } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThreadData } from '@/core/types/thread-data';
import { usePathname, useRouter } from 'next/navigation';
import { createThread } from '@/lib/actions/thread.actions';
import { ThreadValidations } from '@/lib/validations/thread';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

type Props = {
    userId: string;
};

const PostThread = ({ userId }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const { organization } = useOrganization();
    const [disabled, setDisabled] = useState(true);

    const form = useForm({
        resolver: zodResolver(ThreadValidations),
        defaultValues: {
            thread: '',
            accountId: userId,
        }
    });

    const handleChange = (event: React.KeyboardEvent<HTMLTextAreaElement> & { target: HTMLTextAreaElement; }) => {
        form.setValue('thread', event.target.value);
        setDisabled(event.target.value === '');
    };

    const onSubmit = async (values: z.infer<typeof ThreadValidations>) => {
        const thread: ThreadData = {
            text: values.thread,
            author: userId,
            communityId: organization ? organization.id : null,
            path: pathname,
        };

        await createThread(thread);
        router.push('/home');
    };

    return (
        <Form {...form}>
            <form className='mt-10 flex flex-col justify-start gap-10'
                onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name='thread'
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-3'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Content
                            </FormLabel>
                            <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                                <Textarea rows={15} {...field} onChange={handleChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                <Button type='submit' className='bg-primary-500 hover:bg-secondary-500' disabled={disabled}>Post Thread</Button>
            </form>
        </Form>
    );
};

export default PostThread;
