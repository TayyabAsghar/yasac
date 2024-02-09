import Image from 'next/image';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';
import ThreadsTab from '@/components/shared/thread-tab';
import ProfileHeader from '@/components/shared/profile-header';
import { ProfileTabs } from '@/core/constants/navigation-links';
import { fetchUserThreadsCount } from '@/lib/actions/thread.actions';
import { fetchUser, fetchUserByUsername } from '@/lib/actions/user.actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Page = async ({ params }: { params: { username: string; }; }) => {
    const user = await currentUser();
    if (!user) return null;

    let loggedUser: any;
    let userId: string = '';
    let username: string = params.username;
    const userInfo = await fetchUserByUsername(username);
    userId = userInfo._id;

    if (userInfo.id !== user.id) {
        loggedUser = await fetchUser(user.id);

        if (!userInfo?.onboarded) redirect('/onboarding');

        userId = loggedUser._id;
        username = loggedUser.username;
    } else if (!userInfo?.onboarded) redirect('/onboarding');

    const threadCount = await fetchUserThreadsCount(userId);

    return (
        <section>
            <ProfileHeader
                accountId={userInfo._id}
                currentUser={userId}
                name={userInfo.name}
                accountUsername={userInfo.username}
                username={username}
                imgUrl={userInfo.image}
                bio={userInfo.bio}
                type='User'
            />
            <div className='mt-9'>
                <Tabs defaultValue='threads' className='w-full'>
                    <TabsList className='tab'>
                        {ProfileTabs.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                                <Image src={tab.icon} alt={tab.label} title={tab.label} width={24} height={24}
                                    className='object-contain' />
                                <p className='max-sm:hidden'>{tab.label}</p>

                                {tab.label === 'Threads' && (
                                    <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                                        {threadCount}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {ProfileTabs.map((tab) => (
                        <TabsContent key={`content-${tab.label}`} value={tab.value} title={tab.label}
                            className='w-full text-light-1'>
                            <ThreadsTab currentUserId={user.id} accountId={userInfo.id} accountType='User' />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    );
};

export default Page;
