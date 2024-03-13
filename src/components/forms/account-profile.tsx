'use client';

import { z } from 'zod';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { ChangeEvent, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUploadThing } from '@/lib/uploadthing';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUser } from '@/lib/actions/user.actions';
import { usePathname, useRouter } from 'next/navigation';
import { UserValidations } from '@/lib/validations/user';
import { isBase64Image, toTitleCase } from '@/lib/utils';
import { DBUserData, UserData } from '@/core/types/user-data';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

type Props = {
    user: UserData;
    btnTitle: string;
};

const AccountProfile = ({ user, btnTitle }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const { startUpload } = useUploadThing('media');

    const form = useForm({
        resolver: zodResolver(UserValidations(user.username)),
        defaultValues: {
            bio: user.bio,
            email: user.email,
            private: user.private,
            username: user.username,
            profilePhoto: user.image,
            name: toTitleCase(user.name)
        }
    });

    const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault();

        const fileReader = new FileReader();

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFiles(Array.from(e.target.files));

            if (!file.type.includes('image')) return;

            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || '';
                fieldChange(imageDataUrl);
            };

            fileReader.readAsDataURL(file);
        }
    };

    const onSubmit = async (values: z.infer<ReturnType<typeof UserValidations>>) => {
        setLoading(true);
        const hasImageChanged = isBase64Image(values.profilePhoto);
        const userData: DBUserData = {
            name: toTitleCase(values.name),
            path: pathname,
            username: values.username,
            userId: user.id,
            bio: values.bio,
            image: values.profilePhoto,
            private: values.private,
            email: values.email
        };

        if (hasImageChanged) {
            const imgRes = await startUpload(files);

            if (imgRes && imgRes[0].url) userData.image = imgRes[0].url;
        }

        await updateUser(userData).finally(() => setLoading(false));

        if (pathname === '/profile/edit') router.replace(`/profile/${values.username}`);
        else router.push('/home');
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col justify-start gap-10'>

                <FormField control={form.control} name='profilePhoto' render={({ field }) => (
                    <FormItem className='flex items-center gap-4'>
                        <FormLabel className='account-form-image-label'>
                            {field.value ?
                                <Image src={field.value} alt='Profile Photo' title={user.username} width={96} height={96}
                                    className='rounded-full object-contains' priority />
                                : <Image src='/assets/profile.svg' alt='Profile Photo' title={user.username} width={24} height={24}
                                    className='object-contains' />}
                        </FormLabel>
                        <FormControl className='flex-1 text-base-semibold text-gray-200'>
                            <Input className='account-form-image-input' type='file' accept='image/*' placeholder='Upload a photo'
                                onChange={e => handleImage(e, field.onChange)} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name='name' render={({ field }) => (
                    <FormItem className='flex flex-col w-full'>
                        <FormLabel className='text-base-semibold text-light-2'>Name</FormLabel>
                        <FormControl>
                            <Input className='account-form-input no-focus' type='text' placeholder='Name' {...field} onBlur={() => toTitleCase(field.value)} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name='username' render={({ field }) => (
                    <FormItem className='flex flex-col gap-3 w-full'>
                        <FormLabel className='text-base-semibold text-light-2'>Username</FormLabel>
                        <FormControl>
                            <Input className='account-form-input no-focus' type='text' placeholder='Username' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name='email' render={({ field }) => (
                    <FormItem className='flex flex-col gap-3 w-full'>
                        <FormLabel className='text-base-semibold text-light-2'>Email</FormLabel>
                        <FormControl>
                            <Input className='account-form-input no-focus' disabled type='email' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="private"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox className="account-form-input" checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className='text-base-semibold text-light-2 cursor-pointer'>
                                Make account private
                            </FormLabel>
                        </FormItem>
                    )}
                />

                <FormField control={form.control} name='bio' render={({ field }) => (
                    <FormItem className='flex flex-col gap-3 w-full'>
                        <FormLabel className='text-base-semibold text-light-2'>Bio</FormLabel>
                        <FormControl >
                            <Textarea className='account-form-input no-focus' rows={5} {...field}
                                placeholder='Tell people about yourself' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button className='bg-primary-500 hover:bg-secondary-500 disabled:opacity-30' disabled={loading} type='submit'>{btnTitle}</Button>
            </form>
        </Form >
    );
};

export default AccountProfile;
