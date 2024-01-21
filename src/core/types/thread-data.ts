export type ThreadData = {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
};

export type ThreadsObject = {
    name: string;
    image: string;
    id: string;
    threads: {
        _id: string;
        text: string;
        parentId: string | null;
        author: {
            name: string;
            image: string;
            id: string;
        };
        community: {
            id: string;
            name: string;
            image: string;
        } | null;
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
