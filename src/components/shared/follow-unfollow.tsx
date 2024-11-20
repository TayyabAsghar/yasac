'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { followUser, isUserAFollower, unFollowUser } from '@/lib/actions/user.actions';

type Props = {
    accountId: string;
    currentUser: string;
};

const FollowUnfollow = ({ accountId, currentUser }: Props) => {
    const pathname = usePathname();
    const [following, setFollowing] = useState(false);

    useEffect(() => {
        const fetchFollowingState = async () => {
            const isFollowing = await isUserAFollower(accountId, currentUser);
            setFollowing(isFollowing);
        };

        fetchFollowingState();
    }, [accountId, currentUser]);

    const handleClick = async () => {
        const previousState = following;

        try {
            setFollowing((prev) => !prev);

            if (following)
                await unFollowUser(accountId, currentUser, pathname);
            else
                await followUser(accountId, currentUser, pathname);
        } catch (err) {
            setFollowing(previousState);
        }
    };

    return (
        <Button
            className="bg-primary-500 hover:bg-secondary-500"
            onClick={handleClick}
        >
            {following ? 'Unfollow' : 'Follow'}
        </Button>
    );
};

export default FollowUnfollow;
