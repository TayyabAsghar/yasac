'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type Props = {
    id: string;
    name: string;
    imgUrl: string;
    username: string;
    personType: string;
};

export default function UserCard({ id, name, username, imgUrl, personType }: Props) {
    const router = useRouter();
    const isCommunity = personType === 'Community';

    const handleClick = () => {
        if (isCommunity)
            router.push(`/communities/${id}`);
        else
            router.push(`/profile/${id}`);
    };

    return (
        <article className='user-card'>
            <div className='user-card-avatar'>
                <div className='relative h-12 w-12'>
                    <Image src={imgUrl} alt='User Logo' fill
                        className='rounded-full object-cover' />
                </div>

                <div className='flex-1 text-ellipsis'>
                    <h4 className='text-base-semibold text-light-1'>{name}</h4>
                    <p className='text-small-medium text-gray-1'>@{username}</p>
                </div>
            </div>

            <Button className='user-card-btn' onClick={() => handleClick()}>View</Button>
        </article>
    );
}
