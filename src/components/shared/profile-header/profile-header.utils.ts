import { ProfileType } from '@/core/types/profile';
import { getSocialCount } from '@/lib/actions/user.actions';
import { getMembersAndPostCount } from '@/lib/actions/community.actions';

export const fetchCounts = async (type: ProfileType, accountId: string) => {
    if (type === 'User') {
        const { followersCount, followingCount } = await getSocialCount(accountId);
        return {
            count1: followersCount,
            count2: followingCount,
            label1: 'Followers',
            label2: 'Following',
        };
    } else {
        const { membersCount, postsCount } = await getMembersAndPostCount(accountId);
        return {
            count1: membersCount,
            count2: postsCount,
            label1: 'Members',
            label2: 'Posts',
        };
    }
};
