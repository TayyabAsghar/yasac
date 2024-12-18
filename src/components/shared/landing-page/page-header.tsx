import Link from 'next/link';
import Image from 'next/image';
import { Laptop, TabletSmartphone } from 'lucide-react';

const Logo = () => (
    <Link href="/home" className="flex items-center gap-4">
        <Image src="/assets/logo.svg" alt="YASAC Logo" title="YASAC" width={28} height={28} />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">YASAC</p>
    </Link>
);

const PageHeader = () => {
    return (
        <nav className="header">
            <Logo />
            <Link href="/sign-in" title="Login" aria-label="Log in to Connect"
                className="left-sider-link flex items-center h-10 px-4 py-0 bg-primary-500 hover:bg-secondary-500"
            >
                <Laptop className="text-light-1 max-md:hidden" aria-hidden="true" />
                <TabletSmartphone className="text-light-1 hidden max-md:block" aria-hidden="true" />
                <p className="text-light-1 font-medium max-md:hidden">Log in to Connect</p>
            </Link>
        </nav>
    );
};

export default PageHeader;
