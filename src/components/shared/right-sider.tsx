import UserCard from '../cards/user-card';
import { currentUser } from '@clerk/nextjs';
import { UserListOptions } from '@/core/types/user-data';
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import { CommunityListOptions } from '@/core/types/community-data';
import { fetchCommunities } from '@/lib/actions/community.actions';

interface RenderListType {
    items: any[];
    title: string;
    noItemsMessage: string;
    type: 'User' | 'Community';
}

const fetchRightSiderData = async (userId: string) => {
    const userOptions: UserListOptions = {
        pageSize: 3,
        sortBy: 'asc',
        pageNumber: 1,
        searchString: '',
        removeFollowed: true,
        userId,
    } as const;

    const communityOptions: CommunityListOptions = {
        pageSize: 3,
        sortBy: 'asc',
        pageNumber: 1,
        searchString: '',
        userId,
    } as const;

    // Fetch data concurrently
    const [similarMinds, suggestedCommunities] = await Promise.all([
        fetchUsers(userOptions),
        fetchCommunities(communityOptions),
    ]);

    return { similarMinds, suggestedCommunities };
};

const RenderList = ({
    title,
    items,
    type,
    noItemsMessage,
}: RenderListType) => (
    <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">{title}</h3>
        <div className="mt-7 flex w-[350px] flex-col gap-9">
            {items.length > 0 ? (
                items.map((item) => (
                    <UserCard
                        key={item.id.toString()}
                        id={item.id.toString()}
                        name={item.name}
                        username={item.username || item.slug}
                        imgUrl={item.image}
                        personType={type}
                    />
                ))
            ) : (
                <p className="!text-base-regular text-light-3">{noItemsMessage}</p>
            )}
        </div>
    </div>
);

const RightSider = async () => {
    const user = await currentUser();
    if (!user) return null;

    try {
        const userInfo = await fetchUser(user.id);
        const { similarMinds, suggestedCommunities } = await fetchRightSiderData(userInfo._id);

        return (
            <section className="custom-scrollbar right-sider">
                <RenderList
                    title="Suggested Communities"
                    items={suggestedCommunities.communities}
                    type="Community"
                    noItemsMessage="No communities yet"
                />
                <RenderList
                    title="People You May Like"
                    items={similarMinds.users}
                    type="User"
                    noItemsMessage="No users yet"
                />
            </section>
        );
    } catch (error) {
        console.error('Error loading RightSider data:', error);
        return null;
    }
};

export default RightSider;
