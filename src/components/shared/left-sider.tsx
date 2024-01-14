'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { SiderLinks } from '@/core/constants/navigation-links';
import { SignedIn, SignOutButton, useAuth } from '@clerk/nextjs';

export default function LeftSider() {
    const router = useRouter();
    const { userId } = useAuth();
    const pathname = usePathname();

    return (
        <section className='custom-scrollbar left-sider'>
            <div className='flex w-full flex-1 flex-col gap-6 px-6'>
                {SiderLinks.map(link => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;
                    if (link.route === "/profile") link.route = `${link.route}/${userId}`;

                    return (
                        <Link href={link.route} key={link.label}
                            className={`left-sider-link ${isActive && "bg-primary-500 "}`} >
                            <Image src={link.imgURL} alt={link.label} width={24} height={24} />
                            <p className='text-light-1 max-lg:hidden'>{link.label}</p>
                        </Link>
                    );
                })}
            </div>
            <div className='mt-10 px-6'>
                <SignedIn>
                    <SignOutButton signOutCallback={() => router.push("/sign-in")}>
                        <div className='flex cursor-pointer gap-4 p-4'>
                            <Image src='/assets/logout.svg' alt='logout' width={24} height={24} />
                            <p className='text-light-2 max-lg:hidden'>Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </section>
    );
}
