import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';
import Comment from '@/components/forms/comment';
import { fetchUser } from '@/lib/actions/user.actions';
import ThreadCard from '@/components/cards/thread-card';
import { fetchThreadById } from '@/lib/actions/thread.actions';

const Page = async ({ params }: { params: { id: string; }; }) => {
    if (!params.id) return null;

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding');

    const thread = await fetchThreadById(params.id, userInfo._id);

    return (
        <section className='relative'>
            <div>
                <ThreadCard
                    id={thread._id}
                    currentUserId={userInfo._id.toString()}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                    likesCount={thread.likesCount}
                    isLiked={thread.isLiked}
                />
            </div>

            <div className='mt-7'>
                <Comment
                    threadId={params.id}
                    currentUserImg={user.imageUrl}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>

            <div className='mt-10'>
                {thread.children.map((childItem: any) => (
                    <ThreadCard
                        key={childItem._id}
                        id={childItem._id}
                        currentUserId={userInfo._id.toString()}
                        parentId={childItem.parentId}
                        content={childItem.text}
                        author={childItem.author}
                        community={childItem.community}
                        createdAt={childItem.createdAt}
                        comments={childItem.children}
                        likesCount={childItem.likesCount}
                        isLiked={childItem.isLiked}
                        isComment
                    />
                ))}
            </div>
        </section>
    );
};

export default Page;
