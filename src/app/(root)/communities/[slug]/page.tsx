import Image from 'next/image';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';
import UserCard from '@/components/cards/user-card';
import { fetchUser } from '@/lib/actions/user.actions';
import ThreadsTab from '@/components/shared/thread-tab';
import ProfileHeader from '@/components/shared/profile-header/profile-header';
import { CommunityTabs } from '@/core/constants/navigation-links';
import { fetchCommunityDetails } from '@/lib/actions/community.actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Page = async ({ params, searchParams }: { params: { slug: string; }, searchParams: { [key: string]: string | undefined; }; }) => {
    const user = await currentUser();
    if (!user) return null;

    params.slug = params.slug.toLowerCase();
    const queryTab = searchParams.tab?.toLowerCase() ?? '';
    let defaultTab: string = !queryTab ? 'threads' : CommunityTabs.find(tab => tab.value === queryTab)?.value ?? redirect(`/communities/${params.slug}`);
    const [userInfo, communityDetails] = await Promise.all([
        fetchUser(user.id),
        fetchCommunityDetails(params.slug)
    ]);

    return (
        <>
            {communityDetails ?
                < section >
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
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            <TabsContent value='threads' className='w-full text-light-1'>
                                <ThreadsTab currentUserId={userInfo._id} accountId={communityDetails._id.toString()} accountType='Community' />
                            </TabsContent>

                            <TabsContent value='members' className='mt-9 w-full text-light-1'>
                                <section className='mt-9 flex flex-col gap-6'>
                                    {communityDetails.members.map((member: any) => (
                                        <div key={member.id.toString()} className='bg-dark-2 px-3 py-5 rounded-xl'>
                                            <UserCard
                                                key={member.id.toString()}
                                                id={member.id.toString()}
                                                name={member.name}
                                                username={member.username}
                                                imgUrl={member.image}
                                                personType='User'
                                            />
                                        </div>
                                    ))}
                                </section>
                            </TabsContent>

                            <TabsContent value='requests' className='w-full text-light-1 mt-9'>
                                <div className='flex justify-center items-center h-12'>There are no pending requests right now.</div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </section > :
                <section className='flex flex-col gap-4 items-center justify-center h-full text-gray-1'>
                    <p> There is no community with such name.</p>
                </section >
            }
        </>
    );
};

export default Page;
