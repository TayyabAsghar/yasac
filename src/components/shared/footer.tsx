'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SiderLinks } from '@/core/constants/navigation-links';

export default function Footer() {
    const pathname = usePathname();

    return (
        <section className='footer'>
            <div className='footer-container'>
                {SiderLinks.map(link => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

                    return (
                        <Link href={link.route} key={link.label} className={`footer-link ${isActive ? 'bg-primary-500' : 'hover:bg-secondary-500'}`}                        >
                            <Image src={link.imgURL} alt={link.label} title={link.label} width={16} height={16} className='object-contain' />
                            <p className='text-subtle-medium text-light-1 max-sm:hidden'>
                                {link.label.split(/\s+/)[0]}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
