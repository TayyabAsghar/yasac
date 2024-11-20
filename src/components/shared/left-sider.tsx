'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { useEffect, useState } from 'react';
import { fetchUser } from '@/lib/actions/user.actions';
import { usePathname, useRouter } from 'next/navigation';
import { SiderLinks, SiderLinksType } from '@/core/constants/navigation-links';
import { SignedIn, SignOutButton, useAuth, useOrganization, useSignIn } from '@clerk/nextjs';

type DynamicLinksType = SiderLinksType & { isActive: boolean; };

const LeftSider = () => {
    const router = useRouter();
    const { userId } = useAuth();
    const pathname = usePathname();
    const { organization, isLoaded: isOrgLoaded } = useOrganization();
    const isLoadedSignIn = useSignIn().isLoaded;

    const [username, setUsername] = useState('');
    const [dynamicLinks, setDynamicLinks] = useState<DynamicLinksType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            const fetchUserName = async () => {
                const userInfo = await fetchUser(userId);
                setUsername(userInfo.username);
            };
            fetchUserName();
        }
    }, [userId]);

    // Update sidebar links dynamically when dependencies change
    useEffect(() => {
        if (!isOrgLoaded || !isLoadedSignIn) {
            setLoading(true);
            return;
        }

        const updatedLinks: DynamicLinksType[] = SiderLinks.map(link => {
            const route =
                link.route === '/profile'
                    ? organization
                        ? `/communities/${organization.slug}`
                        : username
                            ? `${link.route}/${username}`
                            : link.route
                    : link.route;

            const isThreadRoute = link.route === '/home' && pathname.includes("/thread/");
            const isUserOrgPath = organization?.slug && pathname === `/communities/${organization.slug}`;
            const isActive = (route === pathname || (!isUserOrgPath && pathname.includes(route)) || isThreadRoute);

            return { ...link, route, isActive };
        });

        setDynamicLinks(updatedLinks);
        setLoading(false);
    }, [isOrgLoaded, isLoadedSignIn, username, organization, pathname]);

    // Render the sidebar links
    const renderLinks = () => {
        return SiderLinks.map((link, index) => {
            const dynamicLink = dynamicLinks.find(dl => dl.label === link.label);

            return (!loading && dynamicLink) ?
                <Link
                    className={`left-sider-link ${dynamicLink.isActive ? 'bg-primary-500' : 'hover:bg-secondary-500'}`}
                    href={dynamicLink.route}
                    key={dynamicLink.label}
                >
                    <Image src={dynamicLink.imgURL} alt={dynamicLink.label} title={dynamicLink.label} width={24} height={24} />
                    <p className="text-light-1 max-lg:hidden">{dynamicLink.label}</p>
                </Link> :
                <Skeleton key={index} className="left-sider-link h-14 w-[180px] max-lg:w-14" />;
        });
    };

    const renderLogoutButton = () => {
        return isLoadedSignIn ?
            <SignedIn>
                <SignOutButton signOutCallback={() => router.push('/')}>
                    <div className="flex cursor-pointer gap-4 p-4">
                        <Image src="/assets/logout.svg" alt="Logout" title="Logout" width={24} height={24} />
                        <p className="text-light-2 max-lg:hidden">Logout</p>
                    </div>
                </SignOutButton>
            </SignedIn> :
            <Skeleton className="flex gap-4 p-4 h-6 w-36 max-lg:w-6" />;
    };

    return (
        <section className="custom-scrollbar left-sider">
            <div className="flex w-full flex-1 flex-col gap-6 px-6">{renderLinks()}</div>
            <div className="flex justify-center mt-10 px-6">{renderLogoutButton()}</div>
        </section>
    );
};

export default LeftSider;
