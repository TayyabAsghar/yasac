import Link from 'next/link';
import Image from 'next/image';
import { Laptop, TabletSmartphone } from 'lucide-react';

const PageHeader = () => {
    return (
        <nav className='header'>
            <Link href='/home' className='flex items-center gap-4'>
                <Image src='/assets/logo.svg' alt='Logo' title='Logo' width={28} height={28} />
                <p className='text-heading3-bold text-light-1 max-xs:hidden'>YASAC</p>
            </Link>
            <Link href='/sign-in' title='Login'
                className='left-sider-link flex items-center h-10 px-4 py-0 bg-primary-500 hover:bg-secondary-500' >
                <Laptop className='text-light-1 max-md:hidden' />
                <TabletSmartphone className='text-light-1 hidden max-md:block' />
                <p className='text-light-1 font-medium max-md:hidden'>Log in to Connect</p>
            </Link>
        </nav>
    );
};

export default PageHeader;
