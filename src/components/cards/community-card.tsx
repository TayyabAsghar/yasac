import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type Props = {
    bio: string;
    name: string;
    imgUrl: string;
    slug: string;
    members: {
        image: string;
        username: string;
    }[];
};

const CommunityCard = ({ name, slug, imgUrl, bio, members }: Props) => {
    return (
        <article className='community-card'>
            <div className='flex flex-wrap items-center gap-3'>
                <Link href={`/communities/${slug}`} className='relative h-12 w-12'>
                    <Image src={imgUrl} alt='Community Logo' title={slug} height={48} width={48}
                        className='rounded-full object-cover' />
                </Link>

                <div>
                    <Link href={`/communities/${slug}`}>
                        <h4 className='text-base-semibold text-light-1'>{name}</h4>
                    </Link>
                    <p className='text-small-medium text-gray-1'>@{slug}</p>
                </div>
            </div>

            <p className='mt-4 text-subtle-medium text-gray-1'>{bio}</p>

            <div className='mt-5 flex flex-wrap items-center justify-between gap-3'>
                <Link href={`/communities/${slug}`}>
                    <Button size='sm' className='community-card-btn'>View</Button>
                </Link>

                {members.length > 0 &&
                    <div className='flex items-center'>
                        {members.map((member, index) => (
                            <div key={index} className={`relative overflow-hidden ${index !== 0 && '-ml-2'} rounded-full h-6 w-6`}>
                                <Image src={member.image} alt={`User ${index}`} title={member.username} width={24} height={24}
                                    className='rounded-full' />
                            </div>
                        ))}
                        {members.length > 3 &&
                            <p className='ml-1 text-subtle-medium text-gray-1'>
                                {members.length}+ Users
                            </p>
                        }
                    </div>
                }
            </div>
        </article>
    );
};

export default CommunityCard;
