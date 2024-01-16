import UserCard from '../cards/user-card';
import { currentUser } from '@clerk/nextjs';
import { fetchUsers } from '@/lib/actions/user.actions';
import { UserListOptions } from '@/core/types/user-data';
import { CommunityListOptions } from '@/core/types/community-data';
import { fetchCommunities } from '@/lib/actions/community.actions';

export default async function RightSider() {
    const user = await currentUser();
    if (!user) return null;

    const userOptions: UserListOptions = {
        userId: user.id,
        searchString: '',
        pageNumber: 1,
        pageSize: 4,
        sortBy: 'asc'
    };

    const communityOptions: CommunityListOptions = {
        pageSize: 4,
        sortBy: 'asc',
        searchString: '',
        pageNumber: 1
    };

    const similarMinds = await fetchUsers(userOptions);
    const suggestedCommunities = await fetchCommunities(communityOptions);

    return (
        <section className='custom-scrollbar right-sider'>
            <div className='flex flex-1 flex-col justify-start'>
                <h3 className='text-heading4-medium text-light-1'>
                    Suggested Communities
                </h3>

                <div className='mt-7 flex w-[350px] flex-col gap-9'>
                    {suggestedCommunities.communities.length > 0 ? (
                        <>
                            {suggestedCommunities.communities.map((community) => (
                                <UserCard
                                    key={community.id}
                                    id={community.id}
                                    name={community.name}
                                    username={community.username}
                                    imgUrl={community.image}
                                    personType='Community'
                                />
                            ))}
                        </>
                    ) : (
                        <p className='!text-base-regular text-light-3'>No communities yet</p>
                    )}
                </div>
            </div>

            <div className='flex flex-1 flex-col justify-start'>
                <h3 className='text-heading4-medium text-light-1'>People You May Like</h3>
                <div className='mt-7 flex w-[350px] flex-col gap-10'>
                    {similarMinds.users.length > 0 ? (
                        <>
                            {similarMinds.users.map((person) => (
                                <UserCard
                                    key={person.id}
                                    id={person.id}
                                    name={person.name}
                                    username={person.username}
                                    imgUrl={person.image}
                                    personType='User'
                                />
                            ))}
                        </>
                    ) : (
                        <p className='!text-base-regular text-light-3'>No users yet</p>
                    )}
                </div>
            </div>
        </section>
    );
}
