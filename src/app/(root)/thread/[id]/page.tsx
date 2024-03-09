import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';
import Comment from '@/components/forms/comment';
import { fetchUser } from '@/lib/actions/user.actions';
import ThreadCard from '@/components/cards/thread-card';
import { fetchThreadById } from '@/lib/actions/thread.actions';

const Page = async ({ params }: { params: { id: string; }; }) => {
    let thread;
    if (!params.id) return null;

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding');

    try {
        thread = await fetchThreadById(params.id, userInfo._id);
    } catch {
        return (
            <section className='flex justify-center items-center h-full '>
                <p className='text-gray-1'>
                    {'The thread you are looking for doesn\'t exist.'}
                </p>
            </section>
        );
    };

    return (
        <section className='relative'>
            <div>
                <ThreadCard
                    id={thread._id.toString()}
                    currentUserId={userInfo._id.toString()}
                    parentId={thread.parentId?.toString()}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                    likesCount={thread.likesCount}
                    isLiked={thread.isLiked}
                    isComment={false}
                />
            </div>

            <div className='mt-7'>
                <Comment
                    threadId={params.id.toString()}
                    currentUserImg={user.imageUrl}
                    currentUserId={userInfo._id.toString()}
                    communityId={thread.community?._id?.toString()}
                />
            </div>

            <div className='mt-10'>
                {thread.children.map((childItem: any) => (
                    <ThreadCard
                        key={childItem._id.toString()}
                        id={childItem._id.toString()}
                        currentUserId={userInfo._id.toString()}
                        parentId={childItem.parentId.toString()}
                        content={childItem.text}
                        author={childItem.author}
                        community={childItem.community}
                        createdAt={childItem.createdAt}
                        comments={childItem.children}
                        likesCount={childItem.likesCount}
                        isLiked={childItem.isLiked}
                        isComment={true}
                    />
                ))}
            </div>
        </section>
    );
};

export default Page;
