
import ProfileImage from './profile-image';
import ProfileStats from './profile-stats';
import ProfileActions from './profile-actions';
import { fetchCounts } from './profile-header.utils';

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
    const { count1, count2, label1, label2 } = await fetchCounts(props.type, props.accountId);

    return (
        <div className="flex w-full flex-col justify-start">
            <div className="flex items-center justify-between">
                <div className="flex flex-col items-start gap-3 w-full">
                    {/* Profile Image and Stats */}
                    <div className="flex justify-between items-center w-full">
                        <ProfileImage imgUrl={props.imgUrl} username={props.username} />
                        <ProfileStats
                            stats={[
                                { count: count1, label: label1 },
                                { count: count2, label: label2 },
                            ]}
                        />
                    </div>

                    {/* Name, Username, and Actions */}
                    <div className="flex justify-between items-center w-full">
                        <div className="flex-1">
                            <h2 className="text-left text-heading3-bold text-light-1">{props.name}</h2>
                            <p className="text-base-medium text-gray-1">@{props.username}</p>
                        </div>
                        <ProfileActions
                            type={props.type}
                            username={props.username}
                            accountUsername={props.type === 'User' ? props.accountUsername : undefined}
                            accountId={props.accountId}
                            currentUser={props.type === 'User' ? props.currentUser : undefined}
                        />
                    </div>
                </div>
            </div>

            <p className="mt-6 max-w-lg text-base-regular text-light-2">{props.bio}</p>
            <div className="mt-12 h-0.5 w-full bg-dark-3" />
        </div>
    );
};

export default ProfileHeader;
