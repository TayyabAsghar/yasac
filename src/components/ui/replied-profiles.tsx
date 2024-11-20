import Link from 'next/link';
import Image from 'next/image';
import { ThreadCardType } from '@/core/types/thread-card';
import { getFirstTwoDistinctComments } from '@/lib/utils';

const RepliedProfiles = (threadData: ThreadCardType) => {
    const distinctComments = getFirstTwoDistinctComments(threadData.comments);

    return (
        <div className='ml-2.5 mt-3 flex items-center gap-2'>
            {distinctComments.map((comment, index) => (
                <div key={index} className={`relative overflow-hidden ${index !== 0 && '-ml-2'} rounded-full h-6 w-6`}>
                    <Image src={comment.author.image} alt={comment.author.username} title={comment.author.username} width={24} height={24}
                        className='rounded-full' />
                </div>
            ))}

            <Link href={`/thread/${threadData.id}`}>
                <p className='mt-1 text-subtle-medium text-gray-1'>
                    {threadData.comments.length} repl{threadData.comments.length > 1 ? 'ies' : 'y'}
                </p>
            </Link>
        </div>
    );
};

export default RepliedProfiles;
