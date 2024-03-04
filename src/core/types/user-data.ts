import { SortOrder } from 'mongoose';

export type UserData = {
    id: string;
    bio: string;
    name: string;
    image: string;
    email: string;
    objectId: string;
    username: string;
    private: boolean;
};

export type DBUserData = {
    bio: string;
    name: string;
    path: string;
    image: string;
    email: string;
    userId: string;
    private: boolean;
    username: string;
};

export type UserListOptions = {
    userId: string;
    pageSize: number;
    sortBy: SortOrder;
    pageNumber: number;
    searchString?: string;
    removeFollowed?: boolean;
};

