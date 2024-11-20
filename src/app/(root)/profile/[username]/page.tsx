import Image from 'next/image';
import { redirect } from 'next/navigation';
import { formatNumber } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs';
import UserCard from '@/components/cards/user-card';
import { LockKeyhole, UserRoundX } from 'lucide-react';
import ThreadsTab from '@/components/shared/thread-tab';
import Pagination from '@/components/shared/pagination';
import ProfileHeader from '@/components/shared/profile-header/profile-header';
import { ProfileTabs } from '@/core/constants/navigation-links';
import { fetchUserThreadsCount } from '@/lib/actions/thread.actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchFollowersList, fetchUser, fetchUserByUsername, isPrivateUser, isUserAFollower } from '@/lib/actions/user.actions';

const Page = async ({ params, searchParams }: { params: { username: string; }, searchParams: { [key: string]: string | undefined; }; }) => {
    const user = await currentUser();
    if (!user) return null;

    let userInfo: any;
    let threadCount = 0;
    let loggedUser: any;
    let loggedUserId: string = '';
    let isPrivate, isFollower = false;
    let username: string = params.username ?? '';
    const queryTab = searchParams.tab?.toLowerCase() ?? '';
    let result: { users: any[]; isNext: boolean; } = {
        users: [],
        isNext: false
    };
    let defaultTab: string = !queryTab ? 'threads' : ProfileTabs.find(tab => tab.value === queryTab)?.value ?? redirect(`/profile/${username}`);

    try {
        userInfo = await fetchUserByUsername(username);
        loggedUserId = userInfo._id;

        if (userInfo.id !== user.id) {
            loggedUser = await fetchUser(user.id);

            if (!userInfo?.onboarded) redirect('/onboarding');

            loggedUserId = loggedUser._id;
            username = loggedUser.username;
        } else if (!userInfo?.onboarded) redirect('/onboarding');

        [isPrivate, isFollower] = await Promise.all([
            isPrivateUser(userInfo._id),
            isUserAFollower(userInfo._id, loggedUserId)
        ]);

        if (loggedUserId === userInfo._id || !isPrivate || isFollower) {
            threadCount = await fetchUserThreadsCount(userInfo._id);
            result = await fetchFollowersList({
                pageSize: 25,
                sortBy: 'asc',
                userId: userInfo._id,
                removeFollowed: false,
                pageNumber: searchParams?.page ? + searchParams.page : 1
            });
        }
    } catch {
        return (
            <section className='flex flex-col justify-center items-center h-full gap-4 text-gray-1'>
                <UserRoundX className='h-11 w-11' />
                <p>{'This user doesn\'t exists.'}</p>
            </section>
        );
    }

    return (
        <section className='flex flex-col h-full'>
            <div className='shrink-0'>
                <ProfileHeader
                    accountId={userInfo._id}
                    currentUser={loggedUserId}
                    name={userInfo.name}
                    accountUsername={userInfo.username}
                    username={username}
                    imgUrl={userInfo.image}
                    bio={userInfo.bio}
                    type='User'
                />
            </div>
            <div className='flex justify-center grow mt-9'>
                {loggedUserId !== userInfo._id && isPrivate && !isFollower ?
                    <div className='flex flex-col justify-center items-center gap-2 text-heading3-bold text-light-2'>
                        <LockKeyhole className='w-12 h-12' />
                        <div className=''>This is a private account</div>
                    </div>
                    :
                    <Tabs defaultValue={defaultTab} className='w-full'>
                        <TabsList className='tab'>
                            {ProfileTabs.map((tab) => (
                                <TabsTrigger key={tab.label} value={tab.value} className='tab' tabNavigation={`/profile/${params.username}?tab=${tab.value}`}>
                                    <Image src={tab.icon} alt={tab.label} title={tab.label} width={24} height={24}
                                        className='object-contain' />
                                    <p className='max-sm:hidden'>{tab.label}</p>

                                    {tab.label === 'Threads' && (
                                        <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                                            {formatNumber(threadCount)}
                                        </p>
                                    )}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {ProfileTabs.map((tab) => (
                            <TabsContent key={`content-${tab.label}`} value={tab.value} title={tab.label}
                                className='w-full text-light-1'>
                                {tab.label === 'Threads' &&
                                    <ThreadsTab accountType='User' accountId={userInfo._id} currentUserId={loggedUserId} />
                                }
                                {tab.label === 'Following' &&
                                    <section>
                                        <div className='mt-14 flex flex-col gap-9'>
                                            {result.users.length === 0 ?
                                                <p className='no-result'>No Result</p> :
                                                <>
                                                    {result.users.map((person) => (
                                                        <UserCard key={person.id} id={person.id} name={person.name} username={person.username}
                                                            imgUrl={person.image} personType='User' />
                                                    ))}
                                                </>
                                            }
                                        </div>
                                        <Pagination path={`profile/${username}`} pageNumber={searchParams?.page ? +searchParams.page : 1}
                                            isNext={result.isNext} />
                                    </section>
                                }
                            </TabsContent>
                        ))}
                    </Tabs>
                }
            </div>
        </section>
    );
};

export default Page;
