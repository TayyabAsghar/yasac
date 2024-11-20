'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useDynamicLinks } from '@/core/hooks/useDynamicLinks';
import { SiderLinks } from '@/core/constants/navigation-links';
import { SignedIn, SignOutButton, useSignIn } from '@clerk/nextjs';

const LeftSider = () => {
    const router = useRouter();
    const isLoadedSignIn = useSignIn().isLoaded;
    const { dynamicLinks, loading } = useDynamicLinks();

    const renderLinks = () => {
        return SiderLinks.map((link, index) => {
            const dynamicLink = dynamicLinks.find(dl => dl.label === link.label);

            return (!loading && dynamicLink) ? (
                <Link
                    className={`left-sider-link ${dynamicLink.isActive ? 'bg-primary-500' : 'hover:bg-secondary-500'}`}
                    href={dynamicLink.route}
                    key={dynamicLink.label}
                >
                    <Image src={dynamicLink.imgURL} alt={dynamicLink.label} title={dynamicLink.label} width={24} height={24} />
                    <p className="text-light-1 max-lg:hidden">{dynamicLink.label}</p>
                </Link>
            ) : (
                <Skeleton key={index} className="left-sider-link h-14 w-[180px] max-lg:w-14" />
            );
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