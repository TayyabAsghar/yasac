'use client';

import Link from 'next/link';
import Image from 'next/image';
import { dark } from '@clerk/themes';
import { Skeleton } from '../ui/skeleton';
import { useRouter } from 'next/navigation';
import { OrganizationSwitcher, SignOutButton, SignedIn, useOrganization, useSignIn } from '@clerk/nextjs';

const Header = () => {
    const router = useRouter();
    const isLoadedSignIn = useSignIn().isLoaded;
    const isLoadedOrganization = useOrganization().isLoaded;

    return (
        <nav className='header'>
            <Link href='/home' className='flex items-center gap-4'>
                <Image src='/assets/logo.svg' alt='Logo' title='Logo' width={28} height={28} />
                <p className='text-heading3-bold text-light-1 max-xs:hidden'>YASAC</p>
            </Link>

            <div className='flex items-center gap-1'>
                <div className='block md:hidden'>
                    {isLoadedSignIn ?
                        <SignedIn>
                            <SignOutButton signOutCallback={() => router.push('/')}>
                                <div className='flex cursor-pointer'>
                                    <Image src='/assets/logout.svg' alt='Logout' title='Logout' width={24} height={24} />
                                </div>
                            </SignOutButton>
                        </SignedIn> :
                        <Skeleton className="h-6 w-6" />
                    }
                </div>
                <div className='h-12 w-[180px] max-sm:w-28'>
                    {isLoadedOrganization ?
                        <OrganizationSwitcher appearance={{
                            baseTheme: dark,
                            elements: {
                                organizationSwitcherTrigger: 'py-2 px-4',
                            }
                        }} /> :
                        <Skeleton className="h-full w-full" />
                    }
                </div>
            </div>
        </nav>
    );
};

export default Header;
