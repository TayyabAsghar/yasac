import { SortOrder } from 'mongoose';

export type CommunityData = {
    id: string;
    bio: string;
    name: string;
    slug: string;
    image: string;
    createdById: string;
};

export type CommunityListOptions = {
    userId?: string;
    pageSize: number;
    sortBy: SortOrder;
    pageNumber: number;
    searchString: string;
};

export type community = {
    id: string;
    name: string;
    image: string;
    slug: string;
};
