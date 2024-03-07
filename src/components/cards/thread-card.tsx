import Link from 'next/link';
import Image from 'next/image';
import { formatDateString } from '@/lib/utils';
import ToggleHeart from '../shared/toggle-heart';
import RepliedProfiles from '../ui/replied-profiles';
import { ThreadCard } from '@/core/types/thread-card';
import DeleteThread from '@/components/forms/delete-thread';

const ThreadCard = async (threadData: ThreadCard) => {
    return (
        <article
            className={`flex flex-col rounded-xl w-full  ${threadData.isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'}`}>
            <div className='flex items-start justify-between w-full'>
                <div className='flex flex-col gap-2 w-full'>
                    <div className='flex justify-between items-center w-full max-sm:flex-col max-sm:items-start max-sm:gap-3'>
                        <Link href={`/profile/${threadData.author.username}`} className='relative h-12 w-12'>
                            <div className='flex items-center gap-3 w-max'>
                                <Image src={threadData.author.image} alt='Profile Photo' title={threadData.author.username}
                                    width={48} height={48} className='cursor-pointer rounded-full' />
                                <div className='flex flex-col'>
                                    <h4 className='cursor-pointer text-base-semibold text-light-1'>
                                        {threadData.author.name}
                                    </h4>
                                    <p className='text-base-medium text-gray-1'>@{threadData.author.username}</p>
                                </div>
                            </div>
                        </Link>
                        {!threadData.isComment &&
                            <div className='flex whitespace-pre items-center  max-sm:flex-col'>
                                <p className='text-subtle-medium text-gray-1'>
                                    {formatDateString(threadData.createdAt)}
                                </p>
                                {threadData.community &&
                                    <Link href={`/communities/${threadData.community.slug}`} className='flex items-center'>
                                        <p className='text-gray-1 max-sm:hidden'>
                                            {' - '}
                                        </p>
                                        <p className='text-subtle-medium text-gray-1'>
                                            {`${threadData.community.name} Community`}
                                        </p>
                                        <Image src={threadData.community.image} alt={threadData.community.name} title={threadData.community.name}
                                            width={14} height={14} className='ml-1 rounded-full object-cover' />
                                    </Link>
                                }
                            </div>}
                    </div>
                    <div className='flex h-full'>
                        <div className='thread-card-bar' />
                        <div className='flex flex-col'>
                            <p className='mt-2 text-small-regular break-all text-light-2'>{threadData.content}</p>
                            <div className={`${threadData.isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
                                <div className='flex gap-3.5'>
                                    <ToggleHeart threadId={threadData.id.toString()} userId={threadData.currentUserId.toString()} isLiked={threadData.isLiked}
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
                </div>

                <DeleteThread
                    threadId={threadData.id.toString()}
                    currentUserId={threadData.currentUserId.toString()}
                    authorId={threadData.author.id?.toString()}
                />
            </div>

            {!threadData.isComment && threadData.comments.length > 0 && <RepliedProfiles {...threadData} />}
        </article>
    );
};

export default ThreadCard;
