import { author } from './user-data';
import { community } from './community-data';

export type ThreadData = {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
};

export type ThreadsObject = {
    id: string;
    name: string;
    image: string;
    threads: {
        _id: string;
        text: string;
        parentId: string | null;
        author: author;
        community: community | null;
        createdAt: string;
        children: {
            author: {
                image: string;
            };
        }[];
        likesCount: number;
        isLiked: boolean;
    }[];
};
