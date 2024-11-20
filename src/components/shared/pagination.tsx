'use client';

import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

type Props = {
    path: string;
    isNext: boolean;
    pageNumber: number;
};

const Pagination = ({ pageNumber, isNext, path }: Props) => {
    const router = useRouter();

    const handleNavigation = (type: 'prev' | 'next') => {
        const nextPageNumber = type === 'prev' ? Math.max(1, pageNumber - 1) : pageNumber + 1;
        const query = nextPageNumber > 1 ? `/${path}?page=${nextPageNumber}` : `/${path}`;
        router.push(query);
    };

    if (!isNext && pageNumber === 1) return null;

    return (
        <div className="pagination">
            <Button
                onClick={() => handleNavigation('prev')}
                disabled={pageNumber === 1}
                className="!text-small-regular text-light-2"
            >
                Prev
            </Button>

            <p className="text-small-semibold text-light-1">{pageNumber}</p>

            <Button
                onClick={() => handleNavigation('next')}
                disabled={!isNext}
                className="!text-small-regular text-light-2"
            >
                Next
            </Button>
        </div>
    );
};

export default Pagination;
