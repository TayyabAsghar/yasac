import { redirect } from 'next/navigation';
import ThreadCard from '@/components/cards/thread-card';
import { ThreadsObject } from '@/core/types/thread-data';
import { fetchUserThreads, isPrivateUser, isUserAFollower } from '@/lib/actions/user.actions';
import { fetchCommunityThreads } from '@/lib/actions/community.actions';

type Props = {
    currentUserId: string;
    accountId: string;
    accountType: 'User' | 'Community';
};

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
    let result: ThreadsObject = {
        id: '',
        name: '',
        image: '',
        threads: []
    };

    if (accountType === 'Community') {
        result = await fetchCommunityThreads(accountId, currentUserId);
    } else {
        if (currentUserId === accountId || !await isPrivateUser(accountId) || await isUserAFollower(accountId, currentUserId))
            result = await fetchUserThreads(accountId);
    }

    if (!result) redirect('/home');

    return (
        <section className='mt-9 flex flex-col gap-10'>
            {result.threads && result.threads.map((thread) => (
                <ThreadCard
                    key={thread._id.toString()}
                    id={thread._id.toString()}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={
                        accountType === 'User' ? {
                            name: result.name,
                            image: result.image,
                            id: result.id.toString(),
                            username: result.slug ?? ''
                        } : {
                            name: thread.author.name,
                            image: thread.author.image,
                            id: thread.author.id.toString(),
                            username: thread.author.username
                        }
                    }
                    community={
                        accountType === 'Community'
                            ? { name: result.name, id: result.id.toString(), image: result.image, slug: result?.slug ?? '' }
                            : thread.community
                    }
                    createdAt={thread.createdAt}
                    comments={thread.children}
                    likesCount={thread.likesCount}
                    isLiked={thread.isLiked}
                    isComment={false}
                />
            ))}
        </section>
    );
};

export default ThreadsTab;
