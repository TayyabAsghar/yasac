import Link from 'next/link';
import Image from 'next/image';
import { formatNumber } from '@/lib/utils';
import FollowUnfollow from './follow-unfollow';
import { getSocialCount } from '@/lib/actions/user.actions';
import { getMembersAndPostCount } from '@/lib/actions/community.actions';

type Props = {
    bio: string;
    name: string;
    imgUrl: string;
    username: string;
    accountId: string;
} & (UserProps | CommunityProps);

type UserProps = {
    type: 'User';
    currentUser: string;
    accountUsername: string;
};

type CommunityProps = {
    type: 'Community';
};

const ProfileHeader = async (props: Props) => {
    let { Count1 = 0, Count2 = 0 } = {};
    let { countLabel1 = 'Followers', countLabel2 = 'Following' } = {};
    if (props.type === 'User') {
        const socialCount = await getSocialCount(props.accountId);
        Count1 = socialCount.followersCount;
        Count2 = socialCount.followingCount;
    } else {
        const memberAndPostCount = await getMembersAndPostCount(props.accountId);
        Count1 = memberAndPostCount.membersCount;
        Count2 = memberAndPostCount.postsCount;
        countLabel1 = 'Members';
        countLabel2 = "Posts";
    }

    return (
        <div className='flex w-full flex-col justify-start'>
            <div className='flex items-center justify-between'>
                <div className='flex flex-col items-start gap-3 w-full'>
                    <div className='flex justify-between items-center w-full'>
                        <div className='relative h-20 w-20 object-cover'>
                            <Image src={props.imgUrl} alt='Profile Photo' title='Profile Photo' fill
                                className='rounded-full object-cover shadow-2xl' />
                        </div>
                        <div className='flex justify-between items-center gap-10 max-sm:gap-3'>
                            <div className='text-light-2 text-center'>
                                <div className='text-heading3-bold'>{formatNumber(Count1)}</div>
                                <div className='text-body-medium'>{countLabel1}</div>
                            </div>
                            <div className='text-light-2 text-center'>
                                <div className='text-heading3-bold items-center'>{formatNumber(Count2)}</div>
                                <div className='text-body-medium'>{countLabel2}</div>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-between items-center w-full'>
                        <div className='flex-1'>
                            <h2 className='text-left text-heading3-bold text-light-1'>
                                {props.name}
                            </h2>
                            <p className='text-base-medium text-gray-1'>@{props.username}</p>
                        </div>
                        {props.type !== 'Community' && (props.username === props.accountUsername ?
                            <Link href='/profile/edit'>
                                <div className='flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2'>
                                    <Image src='/assets/edit.svg' alt='Edit Profile' title='Edit Profile' width={16} height={16} />
                                    <p className='text-light-2 max-sm:hidden'>Edit</p>
                                </div>
                            </Link> :
                            <FollowUnfollow accountId={props.accountId} currentUser={props.currentUser} />
                        )}
                    </div>
                </div>
            </div>
            <p className='mt-6 max-w-lg text-base-regular text-light-2'>{props.bio}</p>
            <div className='mt-12 h-0.5 w-full bg-dark-3' />
        </div>
    );
};

export default ProfileHeader;
