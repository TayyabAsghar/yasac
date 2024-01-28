import { community } from './community-data';
import { ThreadAuthor, ThreadComments } from './thread-data';

export type ThreadCard = {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    author: ThreadAuthor;
    community: community | null;
    createdAt: string;
    comments: ThreadComments[];
    isComment: boolean;
    likesCount: number;
    isLiked: boolean;
};
