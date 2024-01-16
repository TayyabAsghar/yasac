import Link from 'next/link';
import Image from 'next/image';
import { formatDateString } from '@/lib/utils';
import { ThreadCard } from '@/core/types/thread-card';
import DeleteThread from '@/components/forms/delete-thread';

export default function ThreadCard(threadData: ThreadCard) {
    return (
        <article
            className={`flex w-full flex-col rounded-xl ${threadData.isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'}`}>
            <div className='flex items-start justify-between'>
                <div className='flex w-full flex-1 flex-row gap-4'>
                    <div className='flex flex-col items-center'>
                        <Link href={`/profile/${threadData.author.id}`} className='relative h-11 w-11'>
                            <Image src={threadData.author.image} alt='User Community Image' fill
                                className='cursor-pointer rounded-full' />
                        </Link>
                        <div className='thread-card_bar' />
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
                                <Image src='/assets/heart-gray.svg' alt='heart' width={24} height={24}
                                    className='cursor-pointer object-contain' />
                                <Link href={`/thread/${threadData.id}`}>
                                    <Image src='/assets/reply.svg' alt='heart' width={24} height={24}
                                        className='cursor-pointer object-contain' />
                                </Link>
                                <Image src='/assets/repost.svg' alt='heart' width={24} height={24}
                                    className='cursor-pointer object-contain' />
                                <Image src='/assets/share.svg' alt='heart' width={24} height={24}
                                    className='cursor-pointer object-contain' />
                            </div>

                            {threadData.isComment && threadData.comments.length > 0 && (
                                <Link href={`/thread/${threadData.id}`}>
                                    <p className='mt-1 text-subtle-medium text-gray-1'>
                                        {threadData.comments.length} repl{threadData.comments.length > 1 ? 'ies' : 'y'}
                                    </p>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <DeleteThread
                    threadId={JSON.stringify(threadData.id)}
                    currentUserId={threadData.currentUserId}
                    authorId={threadData.author.id}
                    parentId={threadData.parentId}
                    isComment={threadData.isComment}
                />
            </div>

            {!threadData.isComment && threadData.comments.length > 0 && (
                <div className='ml-1 mt-3 flex items-center gap-2'>
                    {threadData.comments.slice(0, 2).map((comment, index) => (
                        <Image key={index} src={comment.author.image}
                            alt={`user_${index}`} width={24} height={24}
                            className={`${index !== 0 && '-ml-5'} rounded-full object-cover`} />
                    ))}

                    <Link href={`/thread/${threadData.id}`}>
                        <p className='mt-1 text-subtle-medium text-gray-1'>
                            {threadData.comments.length} repl{threadData.comments.length > 1 ? 'ies' : 'y'}
                        </p>
                    </Link>
                </div>
            )}

            {!threadData.isComment && threadData.community && (
                <Link href={`/communities/${threadData.community.id}`} className='mt-5 flex items-center'>
                    <p className='text-subtle-medium text-gray-1'>
                        {formatDateString(threadData.createdAt)}
                        {threadData.community && ` - ${threadData.community.name} Community`}
                    </p>

                    <Image src={threadData.community.image} alt={threadData.community.name} width={14} height={14}
                        className='ml-1 rounded-full object-cover' />
                </Link>
            )}
        </article>
    );
}
