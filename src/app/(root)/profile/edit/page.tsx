import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';
import { UserData } from '@/core/types/user-data';
import { fetchUser } from '@/lib/actions/user.actions';
import AccountProfile from '@/components/forms/account-profile';

const Page = async () => {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding');

    const userData: UserData = {
        id: user.id,
        objectId: userInfo?._id,
        bio: userInfo ? userInfo?.bio : '',
        private: userInfo ? userInfo.private : false,
        image: userInfo ? userInfo?.image : user.imageUrl,
        username: userInfo ? userInfo?.username : user.username,
        name: userInfo ? userInfo?.name : `${user.firstName ?? ''} ${user.lastName ?? ''}`,
        email: userInfo ? userInfo.email : user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress
    };

    return (
        <>
            <h1 className='head-text'>Edit Profile</h1>
            <p className='mt-3 text-base-regular text-light-2'>Make any changes</p>
            <section className='mt-12'>
                <AccountProfile user={userData} btnTitle='Update' />
            </section>
        </>
    );
};

export default Page;
