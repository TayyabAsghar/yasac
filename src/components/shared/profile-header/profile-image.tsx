import Image from 'next/image';

type ProfileImageProps = {
    imgUrl: string;
    username: string;
};

const ProfileImage = ({ imgUrl, username }: ProfileImageProps) => (
    <div className="relative h-20 w-20">
        <Image
            src={imgUrl}
            alt="Profile Photo"
            title={username}
            height={80}
            width={80}
            className="rounded-full object-cover shadow-2xl"
        />
    </div>
);

export default ProfileImage;
