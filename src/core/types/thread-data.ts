import { community } from './community-data';

export type ThreadData = {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
};

export type ThreadAuthor = {
    name: string;
    image: string;
    id: string;
};

export type ThreadComments = {
    author: {
        image: string;
        username: string;
    };
};

export type ThreadsObject = {
    id: string;
    name: string;
    image: string;
    slug?: string;
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
