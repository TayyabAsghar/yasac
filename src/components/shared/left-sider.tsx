'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { useEffect, useState } from 'react';
import { fetchUser } from '@/lib/actions/user.actions';
import { usePathname, useRouter } from 'next/navigation';
import { SiderLinks } from '@/core/constants/navigation-links';
import { SignedIn, SignOutButton, useAuth, useOrganization, useSignIn } from '@clerk/nextjs';

const LeftSider = () => {
    const router = useRouter();
    const { userId } = useAuth();
    const pathname = usePathname();
    const isLoadedSignIn = useSignIn().isLoaded;
    const [username, setUsername] = useState('');
    const { organization, isLoaded } = useOrganization();

    const fetchUserName = async () => {
        const userInfo = await fetchUser(userId ?? '');
        setUsername(userInfo.username);
    };

    useEffect(() => {
        fetchUserName();
    }, [username]);

    return (
        <section className='custom-scrollbar left-sider'>
            <div className='flex w-full flex-1 flex-col gap-6 px-6'>
                {SiderLinks.map(link => {
                    if (isLoadedSignIn && (username || isLoaded)) {
                        const isActive: boolean = isLoaded ? (organization?.slug === (pathname.split('/')[2]?.toLowerCase() ?? '') ? link.route === '/profile' :
                            pathname.includes(link.route) && link.route.length > 1) || pathname === link.route : false;
                        if (link.route === '/profile')
                            link.route = organization ? `/communities/${organization.slug}` : `${link.route}/${username}`;

                        return (
                            <Link href={link.route} key={link.label}
                                className={`left-sider-link ${isActive ? 'bg-primary-500' : 'hover:bg-secondary-500'}`} >
                                <Image src={link.imgURL} alt={link.label} title={link.label} width={24} height={24} />
                                <p className='text-light-1 max-lg:hidden'>{link.label}</p>
                            </Link>
                        );
                    } else {
                        return (<Skeleton key={link.label} className='left-sider-link h-14 w-[180px] max-lg:w-14' />);
                    }
                })}
            </div>
            <div className='flex justify-center mt-10 px-6'>
                {isLoadedSignIn ?
                    <SignedIn>
                        <SignOutButton signOutCallback={() => router.push('/')}>
                            <div className='flex cursor-pointer gap-4 p-4'>
                                <Image src='/assets/logout.svg' alt='Logout' title='Logout' width={24} height={24} />
                                <p className='text-light-2 max-lg:hidden'>Logout</p>
                            </div>
                        </SignOutButton>
                    </SignedIn> :
                    <Skeleton className="flex gap-4 p-4 h-6 w-36 max-lg:w-6" />
                }
            </div>
        </section>
    );
};

export default LeftSider;
