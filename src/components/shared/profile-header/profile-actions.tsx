import Link from 'next/link';
import Image from 'next/image';
import { ProfileType } from '@/core/types/profile';
import FollowUnfollow from '../follow-unfollow';

type ProfileActionsProps = {
    username: string;
    type: ProfileType;
    accountId: string;
    currentUser?: string;
    accountUsername?: string;
};

const ProfileActions = ({ type, username, accountUsername, accountId, currentUser }: ProfileActionsProps) => {
    if (type === 'Community') return null;

    return username === accountUsername ? (
        <Link href="/profile/edit">
            <div className="flex cursor-pointer gap-3 rounded-lg bg-primary-500 px-4 py-2 hover:bg-secondary-500">
                <Image
                    src="/assets/edit.svg"
                    alt="Edit Profile"
                    title="Edit Profile"
                    width={16} height={16}
                    className="object-contain"
                />
                <p className="text-light-2 max-sm:hidden">Edit</p>
            </div>
        </Link>
    ) : (
        <FollowUnfollow accountId={accountId} currentUser={currentUser!} />
    );
};

export default ProfileActions;
