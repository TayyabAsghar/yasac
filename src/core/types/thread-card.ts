import { author } from './user-data';
import { community } from './community-data';

export type ThreadCard = {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    author: author;
    community: community | null;
    createdAt: string;
    comments: {
        author: {
            image: string;
        };
    }[];
    isComment?: boolean;
    likesCount: number;
    isLiked: boolean;
};
