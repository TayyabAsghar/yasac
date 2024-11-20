'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import useDebounce from '@/core/hooks/useDebounce';
import { useRouter, useSearchParams } from 'next/navigation';

type Props = {
    routeType: string;
};

const SearchBar = ({ routeType }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('q') || '';
    const [search, setSearch] = useState(initialSearch);
    const debouncedSearch = useDebounce(search, 0);

    useEffect(() => {
        const query = debouncedSearch ? `/${routeType}?q=${debouncedSearch}` : `/${routeType}`;
        router.push(query);
    }, [debouncedSearch, routeType, router]);

    const placeholderText =
        routeType === 'search' ? 'Search creators' : 'Search communities';

    return (
        <div className="search-bar">
            <Image
                src="/assets/search-gray.svg"
                alt="Search"
                title="Search"
                width={24}
                height={24}
                className="object-contain"
            />
            <Input
                id="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholderText}
                className="no-focus search-bar-input"
            />
        </div>
    );
};

export default SearchBar;
