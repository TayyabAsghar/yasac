import { redirect } from 'next/navigation';
import ThreadCard from '@/components/cards/thread-card';
import { ThreadsObject } from '@/core/types/thread-data';
import { fetchUserThreads } from '@/lib/actions/user.actions';
import { fetchCommunityThreads } from '@/lib/actions/community.actions';

type Props = {
    currentUserId: string;
    accountId: string;
    accountType: string;
};

export default async function ThreadsTab({ currentUserId, accountId, accountType }: Props) {
    let result: ThreadsObject;

    if (accountType === 'Community')
        result = await fetchCommunityThreads(accountId);
    else
        result = await fetchUserThreads(accountId);


    if (!result) redirect('/home');

    return (
        <section className='mt-9 flex flex-col gap-10'>
            {result.threads.map((thread) => (
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={
                        accountType === 'User'
                            ? { name: result.name, image: result.image, id: result.id }
                            : {
                                name: thread.author.name,
                                image: thread.author.image,
                                id: thread.author.id,
                            }
                    }
                    community={
                        accountType === 'Community'
                            ? { name: result.name, id: result.id, image: result.image }
                            : thread.community
                    }
                    createdAt={thread.createdAt}
                    comments={thread.children}
                    likesCount={thread.likesCount}
                    isLiked={thread.isLiked}
                />
            ))}
        </section>
    );
}
