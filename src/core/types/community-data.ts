import { SortOrder } from 'mongoose';

export type CommunityData = {
    id: string;
    bio: string;
    name: string;
    image: string;
    username: string;
    createdById: string;
};

export type CommunityListOptions = {
    pageSize: number;
    sortBy: SortOrder;
    pageNumber: number;
    searchString: string;
};

export type community = {
    id: string;
    name: string;
    image: string;
};
