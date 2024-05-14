'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { fetchUser } from '@/lib/actions/user.actions';
import { SiderLinks } from '@/core/constants/navigation-links';
import { useAuth, useOrganization, useSignIn } from '@clerk/nextjs';
import { Skeleton } from '../ui/skeleton';

const Footer = () => {
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
        <section className='footer'>
            <div className='footer-container'>
                {SiderLinks.map(link => {
                    if (isLoadedSignIn && (username || isLoaded)) {

                        const isActive: boolean = isLoaded ? (organization?.slug === (pathname.split('/')[2]?.toLowerCase() ?? '') ? link.route === '/profile' :
                            pathname.includes(link.route) && link.route.length > 1) || pathname === link.route : false;
                        if (link.route === '/profile')
                            link.route = organization ? `/communities/${organization.slug}` : `${link.route}/${username}`;

                        return (
                            <Link href={link.route} key={link.label} className={`footer-link ${isActive ? 'bg-primary-500' : 'hover:bg-secondary-500'}`}                        >
                                <Image src={link.imgURL} alt={link.label} title={link.label} width={16} height={16} className='object-contain' />
                                <p className='text-subtle-medium text-light-1 max-sm:hidden'>
                                    {link.label.split(/\s+/)[0]}
                                </p>
                            </Link>
                        );
                    } else {
                        return (<Skeleton key={link.label} className='footer-link h-[60px] max-sm:h-8 max-sm:w-8' />);
                    }
                })}
            </div>
        </section>
    );
};

export default Footer;
