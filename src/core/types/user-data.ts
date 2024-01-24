import { SortOrder } from 'mongoose';

export type UserData = {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
};

export type DBUserData = {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
};

export type UserListOptions = {
    userId: string;
    searchString: string;
    pageNumber: number;
    pageSize: number;
    sortBy: SortOrder;
};


export type author = {
    name: string;
    image: string;
    id: string;
};
