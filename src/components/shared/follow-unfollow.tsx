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

    const userAFollowingState = async () => setFollowing(await isUserAFollower(accountId, currentUser));

    useEffect(() => { userAFollowingState(); }, [following]);

    const handleClick = async () => {
        try {
            if (following) {
                setFollowing(!following);
                await unFollowUser(accountId, currentUser, pathname);
            } else {
                setFollowing(!following);
                await followUser(accountId, currentUser, pathname);
            }
        } catch (err) {
            setFollowing(!following);
        }
    };

    return (
        <Button className='bg-primary-500 hover:bg-secondary-500' onClick={handleClick}>
            {following ? 'Unfollow' : 'Follow'}
        </Button>
    );
};

export default FollowUnfollow;
