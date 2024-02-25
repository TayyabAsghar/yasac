import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/actions/user.actions';
import ThreadCard from '@/components/cards/thread-card';
import Pagination from '@/components/shared/pagination';
import { fetchThread } from '@/lib/actions/thread.actions';
import { SiderLinks } from '@/core/constants/navigation-links';

const Page = async ({ searchParams, }: { searchParams: { [key: string]: string | undefined; }; }) => {
    const user = await currentUser();
    if (!user) return null;

    const siderLink = SiderLinks.find(link => link.label === 'Search');

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding');

    const result = await fetchThread(userInfo._id, searchParams.page ? +searchParams.page : 1, 30);

    return (
        <>
            <h1 className='head-text text-left'>Home</h1>

            <section className='mt-9 flex flex-col gap-10'>
                {result.posts.length ?
                    <>
                        {result.posts.map((post) => (
                            <ThreadCard
                                key={post._id.toString()}
                                id={post._id.toString()}
                                currentUserId={userInfo._id.toString()}
                                parentId={post?.parentId?.toString()}
                                content={post.text}
                                author={post.author}
                                community={post.community}
                                createdAt={post.createdAt}
                                comments={post.children}
                                likesCount={post.likesCount}
                                isLiked={post.isLiked}
                                isComment={false}
                            />
                        ))}
                    </> :
                    <p className='no-result'>No threads found</p>
                }
            </section>

            {!result.isNext && result.posts.length && siderLink &&
                <div className='flex flex-col items-center gap-4'>
                    <div className='mt-12 h-1 w-full bg-dark-2' />
                    <div className='text-base-semibold text-light-1 p-3'>
                        Follow more peoples to see new threads.
                    </div>
                    <Link href={siderLink.route ?? ''} key={siderLink.label}
                        className={`left-sider-link ${true ? 'bg-primary-500' : 'hover:bg-secondary-500'}`} >
                        <Image src={siderLink.imgURL} alt={siderLink.label ?? ''} title={siderLink.label} width={24} height={24} />
                        <p className='text-light-1 max-xs:hidden'>{siderLink.label ?? ''}</p>
                    </Link>
                </div>

            }

            <Pagination path='/home' pageNumber={searchParams?.page ? +searchParams.page : 1}
                isNext={result.isNext} />
        </>
    );
};

export default Page;
