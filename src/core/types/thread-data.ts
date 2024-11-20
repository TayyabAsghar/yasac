import { community } from './community-data';

export type ThreadData = {
    text: string,
    path: string,
    author: string,
    image: File | undefined,
    communityId: string | null;
};

export type ThreadAuthor = {
    _id: string;
    name: string;
    image: string;
    username: string;
};

export type ThreadComments = {
    author: {
        image: string;
        username: string;
    };
};

export type ThreadsObject = {
    _id: string;
    name: string;
    image: string;
    slug?: string;
    username?: string;
    threads: {
        _id: string;
        text: string;
        parentId: string | null;
        author: ThreadAuthor;
        community: community | null;
        createdAt: string;
        children: ThreadComments[];
        likesCount: number;
        isLiked: boolean;
    }[];
};
