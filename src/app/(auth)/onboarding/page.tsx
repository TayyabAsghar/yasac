import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';
import { UserData } from '@/core/types/user-data';
import { fetchUser } from '@/lib/actions/user.actions';
import AccountProfile from '@/components/forms/account-profile';

const Page = async () => {
    const user = await currentUser();
    if (!user) return null;

    let userInfo: any;
    try {
        userInfo = await fetchUser(user.id);
        if (userInfo?.onboarded) redirect('/home');
    } catch { }

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
        <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
            <h1 className='head-text'>Onboarding</h1>
            <p className='mt-3 text-base-regular text-light-2'>
                Complete your profile now, to use YASAC.
            </p>

            <section className='mt-9 bg-dark-2 p-10'>
                <AccountProfile user={userData} btnTitle='Submit' />
            </section>
        </main>
    );
};

export default Page;
