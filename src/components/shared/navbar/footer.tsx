'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useDynamicLinks } from '@/core/hooks/useDynamicLinks';
import { SiderLinks } from '@/core/constants/navigation-links';

const Footer = () => {
    const { dynamicLinks, loading } = useDynamicLinks();

    const renderLinks = () => {
        return SiderLinks.map((link, index) => {
            const dynamicLink = dynamicLinks.find(dl => dl.label === link.label);

            return (!loading && dynamicLink) ? (
                <Link
                    href={dynamicLink.route}
                    key={dynamicLink.label}
                    className={`footer-link ${dynamicLink.isActive ? 'bg-primary-500' : 'hover:bg-secondary-500'}`}
                >
                    <Image
                        src={dynamicLink.imgURL}
                        alt={dynamicLink.label}
                        title={dynamicLink.label}
                        width={16}
                        height={16}
                        className="object-contain"
                    />
                    <p className="text-subtle-medium text-light-1 max-sm:hidden">
                        {dynamicLink.label.split(/\s+/)[0]}
                    </p>
                </Link>
            ) : (
                <Skeleton key={index} className="footer-link h-[60px] max-sm:h-8 max-sm:w-8" />
            );
        });
    };

    return (
        <section className="footer">
            <div className="footer-container">{renderLinks()}</div>
        </section>
    );
};

export default Footer;
