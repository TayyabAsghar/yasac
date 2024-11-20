export const SiderLinks: SiderLinksType[] = [{
    label: 'Home',
    route: '/home',
    imgURL: '/assets/home.svg'
}, {
    label: 'Search',
    route: '/search',
    imgURL: '/assets/search.svg'
}, {
    label: 'Activity',
    route: '/activity',
    imgURL: '/assets/heart.svg'
}, {
    label: 'Create Thread',
    route: '/create-thread',
    imgURL: '/assets/create.svg'
}, {
    label: 'Communities',
    route: '/communities',
    imgURL: '/assets/community.svg'
}, {
    route: '/profile',
    label: 'Profile',
    imgURL: '/assets/user.svg'
}];

export const ProfileTabs: ProfileTabsType[] = [{
    value: 'threads',
    label: 'Threads',
    icon: '/assets/reply.svg'
}, {
    value: 'replies',
    label: 'Replies',
    icon: '/assets/members.svg'
}, {
    value: 'following',
    label: 'Following',
    icon: '/assets/following.svg'
}];

export const CommunityTabs: CommunityTabsType[] = [{
    value: 'threads',
    label: 'Threads',
    icon: '/assets/reply.svg'
}, {
    value: 'members',
    label: 'Members',
    icon: '/assets/members.svg'
}, {
    value: 'requests',
    label: 'Requests',
    icon: '/assets/requests.svg'
}];

export type SiderLinksType = {
    label: string;
    route: string;
    imgURL: string;
};
export type ProfileTabsType = {
    value: string;
    label: string;
    icon: string;
};
export type CommunityTabsType = {
    value: string;
    label: string;
    icon: string;
};
