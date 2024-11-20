import { redirect } from 'next/navigation';
import ThreadCard from '@/components/cards/thread-card';
import { ThreadsObject } from '@/core/types/thread-data';
import { fetchCommunityThreads } from '@/lib/actions/community.actions';
import { fetchUserThreads, isPrivateUser, isUserAFollower } from '@/lib/actions/user.actions';

type Props = {
    accountId: string;
    currentUserId: string;
    accountType: 'User' | 'Community';
};

const canAccessUserThreads = async (currentUserId: string, accountId: string): Promise<boolean> => {
    if (currentUserId === accountId) return true; // Owner of the account
    if (!(await isPrivateUser(accountId))) return true; // Public account
    if (await isUserAFollower(accountId, currentUserId)) return true; // User is a follower
    return false;
};

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
    let result: ThreadsObject | null = null;

    if (accountType === 'Community')
        result = await fetchCommunityThreads(accountId, currentUserId);
    else if (await canAccessUserThreads(currentUserId, accountId))
        result = await fetchUserThreads(accountId);

    if (!result) redirect('/home');

    // Helper to determine author details
    const getAuthorDetails = (thread: typeof result['threads'][number]) => {
        if (accountType === 'User') {
            return {
                name: result?.name ?? '',
                image: result?.image ?? '',
                _id: result?._id?.toString() ?? '',
                username: result?.username ?? '',
            };
        }
        return {
            name: thread.author?.name ?? '',
            image: thread.author?.image ?? '',
            _id: thread.author?._id?.toString() ?? '',
            username: thread.author?.username ?? '',
        };
    };

    // Helper to determine community details
    const getCommunityDetails = (thread: typeof result['threads'][number]) => {
        if (accountType === 'Community') {
            return {
                name: result?.name ?? '',
                id: result?._id?.toString() ?? '',
                image: result?.image ?? '',
                slug: result?.slug ?? '',
            };
        }
        return thread.community;
    };

    return (
        <section className="mt-9 flex flex-col gap-10">
            {result?.threads?.map((thread) => (
                <ThreadCard
                    key={thread._id.toString()}
                    id={thread._id.toString()}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={getAuthorDetails(thread)}
                    community={getCommunityDetails(thread)}
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
