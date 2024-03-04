import Image from 'next/image';
import { formatNumber } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs';
import UserCard from '@/components/cards/user-card';
import ThreadsTab from '@/components/shared/thread-tab';
import ProfileHeader from '@/components/shared/profile-header';
import { CommunityTabs } from '@/core/constants/navigation-links';
import { fetchUserThreadsCount } from '@/lib/actions/thread.actions';
import { fetchCommunityDetails } from '@/lib/actions/community.actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { redirect } from 'next/navigation';

const Page = async ({ params, searchParams }: { params: { slug: string; }, searchParams: { [key: string]: string | undefined; }; }) => {
    const user = await currentUser();
    if (!user) return null;

    const queryTab = searchParams.tab?.toLowerCase() ?? '';
    let defaultTab: string = !queryTab ? 'threads' : CommunityTabs.find(tab => tab.value === queryTab)?.value ?? redirect(`/communities/${params.slug}`);
    const communityDetails = await fetchCommunityDetails(params.slug);
    const threadCount = await fetchUserThreadsCount(communityDetails._id);

    return (
        <section>
            <ProfileHeader
                accountId={communityDetails._id.toString()}
                name={communityDetails.name}
                username={params.slug}
                imgUrl={communityDetails.image}
                bio={communityDetails.bio}
                type='Community'
            />

            <div className='mt-9'>
                <Tabs defaultValue={defaultTab} className='w-full'>
                    <TabsList className='tab'>
                        {CommunityTabs.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.value} tabNavigation={`/communities/${params.slug}?tab=${tab.value}`} className='tab'>
                                <Image src={tab.icon} alt={tab.label} title={tab.label} width={24} height={24}
                                    className='object-contain' />
                                <p className='max-sm:hidden'>{tab.label}</p>

                                {tab.label === 'Threads' &&
                                    <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                                        {formatNumber(threadCount)}
                                    </p>
                                }
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value='threads' className='w-full text-light-1'>
                        <ThreadsTab currentUserId={user.id} accountId={communityDetails._id.toString()} accountType='Community' />
                    </TabsContent>

                    <TabsContent value='members' className='mt-9 w-full text-light-1'>
                        <section className='mt-9 flex flex-col gap-10'>
                            {communityDetails.members.map((member: any) => (
                                <UserCard
                                    key={member.id.toString()}
                                    id={member.id.toString()}
                                    name={member.name}
                                    username={member.username}
                                    imgUrl={member.image}
                                    personType='User'
                                />
                            ))}
                        </section>
                    </TabsContent>

                    <TabsContent value='requests' className='w-full text-light-1'>
                        <ThreadsTab currentUserId={user.id} accountId={communityDetails._id.toString()} accountType='Community' />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
};

export default Page;
