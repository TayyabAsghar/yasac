'use client';

import { z } from 'zod';
import Image from 'next/image';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { Textarea } from '../ui/textarea';
import { isBase64Image } from '@/lib/utils';
import { ChangeEvent, useState } from 'react';
import { UserData } from '@/core/types/user-data';
import { useUploadThing } from '@/lib/uploadthing';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserValidations } from '@/lib/validations/user';
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

type Props = {
    user: UserData;
    btnTitle: string;
};

export default function AccountProfile({ user, btnTitle }: Props) {
    const [files, setFiles] = useState<File[]>([]);
    const { startUpload } = useUploadThing("media");

    const form = useForm({
        resolver: zodResolver(UserValidations),
        defaultValues: {
            bio: user.bio,
            name: user.name,
            username: user.username,
            profilePhoto: user.image
        }
    });

    const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault();

        const fileReader = new FileReader();

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFiles(Array.from(e.target.files));

            if (!file.type.includes("image")) return;

            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || "";
                fieldChange(imageDataUrl);
            };

            fileReader.readAsDataURL(file);
        }
    };

    const onSubmit = async (values: z.infer<typeof UserValidations>) => {
        const hasImageChanged = isBase64Image(values.profilePhoto);

        if (hasImageChanged) {
            const imgRes = await startUpload(files);

            if (imgRes && imgRes[0].url) {
                values.profilePhoto = imgRes[0].url;
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col justify-start gap-10'>
                <FormField control={form.control} name='profilePhoto'
                    render={({ field }) => (
                        <FormItem className='flex items-center gap-4'>
                            <FormLabel className='account-form-image-label'>
                                {field.value ?
                                    <Image src={field.value} alt='Profile Photo' width={96} height={96}
                                        className='rounded-full object-contains' priority />
                                    : <Image src='/assets/profile.svg' alt='Profile Photo' width={24} height={24}
                                        className='object-contains' />}
                            </FormLabel>
                            <FormControl className='flex-1 text-base-semibold text-gray-200'>
                                <Input className='account-form-image-input' type='file' accept='image/*' placeholder='Upload a photo'
                                    onChange={e => handleImage(e, field.onChange)} />
                            </FormControl>
                        </FormItem>
                    )} />
                <FormField control={form.control} name='name'
                    render={({ field }) => (
                        <FormItem className='flex flex-col w-full'>
                            <FormLabel className='text-base-semibold text-light-2'>Name</FormLabel>
                            <FormControl>
                                <Input className='account-form-input no-focus' type='text' placeholder='Name' {...field} />
                            </FormControl>
                        </FormItem>
                    )} />
                <FormField control={form.control} name='username'
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                            <FormLabel className='text-base-semibold text-light-2'>Username</FormLabel>
                            <FormControl>
                                <Input className='account-form-input no-focus' type='text' placeholder='Username' {...field} />
                            </FormControl>
                        </FormItem>
                    )} />
                <FormField control={form.control} name='bio'
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 w-full'>
                            <FormLabel className='text-base-semibold text-light-2'>Bio</FormLabel>
                            <FormControl >
                                <Textarea className='account-form-input no-focus' rows={10} {...field}
                                    placeholder='Tell people about yourself' />
                            </FormControl>
                        </FormItem>
                    )} />
                <Button className='bg-primary-500' type="submit">{btnTitle}</Button>
            </form>
        </Form >
    );
};