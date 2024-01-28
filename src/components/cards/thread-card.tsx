import Link from 'next/link';
import Image from 'next/image';
import { formatDateString } from '@/lib/utils';
import ToggleHeart from '../shared/toggle-heart';
import RepliedProfiles from '../ui/replied-profiles';
import { ThreadCard } from '@/core/types/thread-card';
import DeleteThread from '@/components/forms/delete-thread';

const ThreadCard = (threadData: ThreadCard) => {
    return (
        <article
            className={`flex w-full flex-col rounded-xl ${threadData.isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'}`}>
            <div className='flex items-start justify-between'>
                <div className='flex w-full flex-1 flex-row gap-4'>
                    <div className='flex flex-col items-center'>
                        <Link href={`/profile/${threadData.author.id}`} className='relative h-11 w-11'>
                            <Image src={threadData.author.image} alt='Profile Photo' title='Profile Photo' fill
                                className='cursor-pointer rounded-full' />
                        </Link>
                        <div className='thread-card-bar' />
                    </div>

                    <div className='flex w-full flex-col'>
                        <Link href={`/profile/${threadData.author.id}`} className='w-fit'>
                            <h4 className='cursor-pointer text-base-semibold text-light-1'>
                                {threadData.author.name}
                            </h4>
                        </Link>

                        <p className='mt-2 text-small-regular text-light-2'>{threadData.content}</p>

                        <div className={`${threadData.isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
                            <div className='flex gap-3.5'>
                                <ToggleHeart threadId={threadData.id.toString()} userId={threadData.currentUserId} isLiked={threadData.isLiked}
                                    likesCount={threadData.likesCount} />
                                <Link href={`/thread/${threadData.id}`}>
                                    <Image src='/assets/reply.svg' alt='Replay' title='Replay' width={24} height={24}
                                        className='cursor-pointer object-contain' />
                                </Link>
                                <Image src='/assets/repost.svg' alt='Repost' title='Repost' width={24} height={24}
                                    className='cursor-pointer object-contain' />
                                <Image src='/assets/share.svg' alt='Share' title='Share' width={24} height={24}
                                    className='cursor-pointer object-contain' />
                            </div>

                            {threadData.isComment && threadData.comments.length > 0 && <RepliedProfiles {...threadData} />}
                        </div>
                    </div>
                </div>

                <DeleteThread
                    threadId={threadData.id.toString()}
                    currentUserId={threadData.currentUserId}
                    authorId={threadData.author.id}
                    parentId={threadData.parentId}
                    isComment={threadData.isComment}
                />
            </div>

            {!threadData.isComment && threadData.comments.length > 0 && <RepliedProfiles {...threadData} />}

            {!threadData.isComment && threadData.community && (
                <Link href={`/communities/${threadData.community.id}`} className='mt-5 flex items-center'>
                    <p className='text-subtle-medium text-gray-1'>
                        {formatDateString(threadData.createdAt)}
                        {threadData.community && ` - ${threadData.community.name} Community`}
                    </p>

                    <Image src={threadData.community.image} alt={threadData.community.name} title={threadData.community.name}
                        width={14} height={14} className='ml-1 rounded-full object-cover' />
                </Link>
            )}
        </article>
    );
};

export default ThreadCard;
