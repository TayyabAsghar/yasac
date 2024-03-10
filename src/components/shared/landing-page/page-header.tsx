import Link from 'next/link';
import Image from 'next/image';

const PageHeader = () => {
    return (
        <nav className='header'>
            <Link href='/home' className='flex items-center gap-4'>
                <Image src='/assets/logo.svg' alt='Logo' title='Logo' width={28} height={28} />
                <p className='text-heading3-bold text-light-1 max-xs:hidden'>YASAC</p>
            </Link>

            <div className='flex items-center gap-1'>
                <div className='block md:hidden'>
                </div>
            </div>
        </nav>
    );
};

export default PageHeader;
