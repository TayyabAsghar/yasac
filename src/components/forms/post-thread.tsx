'use client';

import * as z from 'zod';
import Image from 'next/image';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { ImagePlus, Trash } from 'lucide-react';
import { useOrganization } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import TextEditor from '../text-editor/text-editor';
import { AcceptedImageTypes } from '@/lib/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThreadData } from '@/core/types/thread-data';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
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
    type ThreadValidationsType = z.infer<typeof ThreadValidations>;

    const form = useForm<ThreadValidationsType>({
        resolver: zodResolver(ThreadValidations),
        defaultValues: {
            thread: '',
            accountId: userId,
        }
    });

    const handleEditorChange = (html: string, text: string) => {
        form.setValue('thread', html);
        setDisabled(text.trim() === '');
    };

    const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
        form.setValue("threadImage", event.target.files ? event.target.files[0] : undefined);
    };

    const removeImage = () => {
        form.setValue("threadImage", undefined);
    };

    const onSubmit = async (values: z.infer<typeof ThreadValidations>) => {
        try {
            const thread: ThreadData = {
                text: values.thread,
                author: userId,
                image: values.threadImage,
                communityId: organization?.id ?? null,
                path: pathname,
            };

            await createThread(thread);
            router.push('/home');
        } catch (error) {
            console.error("Error posting thread:", error);
        }
    };

    return (
        <Form {...form}>
            <form
                className="mt-10 flex flex-col justify-start gap-10"
                onSubmit={form.handleSubmit(onSubmit)}>

                {/* Thread Content Field */}
                <FormField control={form.control} name="thread" render={({ field }) => (
                    <FormItem className="flex w-full flex-col gap-3">
                        <FormLabel className="text-base-semibold text-light-2">
                            Content
                        </FormLabel>
                        <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                            <div className="flex" {...field}>
                                <TextEditor className="w-full relative" content={field.value} onChange={handleEditorChange} />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

                {/* Image Upload Field */}
                {/* <FormField
                    control={form.control}
                    name="threadImage"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3">
                            <FormControl>
                                {field.value ? (
                                    <div className="flex justify-center items-center max-w-full max-h-80 bg-dark-3 relative">
                                        <Image
                                            className="max-w-full max-h-80 object-contain"
                                            alt="Uploaded Thread" src={URL.createObjectURL(field.value)}
                                            layout="intrinsic" />
                                        <div className="absolute top-0 right-0 bg-accent-100">
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                title="Remove"
                                                aria-label="Remove Image"
                                                onClick={() => removeImage()}
                                            >
                                                <Trash />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div id="picture-box">
                                        <Input
                                            className="hidden"
                                            id="picture"
                                            type="file"
                                            onChange={handleImage}
                                            accept={AcceptedImageTypes.join(",")}
                                        />
                                        <label htmlFor="picture">
                                            <div
                                                className="max-w-full cursor-pointer bg-dark-3 h-48 flex justify-center items-center flex-col gap-5 text-light-2 border border-dashed border-gray-500"
                                                {...field}
                                            >
                                                <ImagePlus className="size-16" />
                                                <div className="text-heading4-medium">Click to upload image</div>
                                            </div>
                                        </label>
                                    </div>
                                )}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}

                <Button className="bg-primary-500 hover:bg-secondary-500" type="submit" disabled={disabled}>
                    Post Thread
                </Button>
            </form>
        </Form>
    );
};

export default PostThread;
