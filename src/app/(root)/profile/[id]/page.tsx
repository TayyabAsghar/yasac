import Image from 'next/image';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/actions/user.actions';
import ThreadsTab from '@/components/shared/thread-tab';
import ProfileHeader from '@/components/shared/profile-header';
import { ProfileTabs } from '@/core/constants/navigation-links';
import { fetchUserThreadsCount } from '@/lib/actions/thread.actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Page = async ({ params }: { params: { id: string; }; }) => {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(params.id);
    if (!userInfo?.onboarded) redirect('/onboarding');

    const threadCount = await fetchUserThreadsCount(userInfo._id);

    return (
        <section>
            <ProfileHeader
                accountId={userInfo.id}
                authUserId={user.id}
                name={userInfo.name}
                username={userInfo.username}
                imgUrl={userInfo.image}
                bio={userInfo.bio}
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
