import UserCard from '../cards/user-card';
import { currentUser } from '@clerk/nextjs';
import { UserListOptions } from '@/core/types/user-data';
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import { CommunityListOptions } from '@/core/types/community-data';
import { fetchCommunities } from '@/lib/actions/community.actions';

const RightSider = async () => {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    const userOptions: UserListOptions = {
        pageSize: 3,
        sortBy: 'asc',
        pageNumber: 1,
        searchString: '',
        removeFollowed: true,
        userId: userInfo._id
    };

    const communityOptions: CommunityListOptions = {
        pageSize: 3,
        sortBy: 'asc',
        pageNumber: 1,
        searchString: '',
        userId: userInfo._id
    };

    let similarMinds: { users: any[]; isNext: boolean; };
    let suggestedCommunities: { communities: any[]; isNext: boolean; };

    try {
        [similarMinds, suggestedCommunities] = await Promise.all([
            fetchUsers(userOptions),
            fetchCommunities(communityOptions)
        ]);
    } catch {
        return;
    }

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
                                    key={community.id.toString()}
                                    id={community.id.toString()}
                                    name={community.name}
                                    username={community.slug}
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
                                    key={person.id.toString()}
                                    id={person.id.toString()}
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
};

export default RightSider;
