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
};

type author = {
    name: string;
    image: string;
    id: string;
};

type community = {
    id: string;
    name: string;
    image: string;
};
