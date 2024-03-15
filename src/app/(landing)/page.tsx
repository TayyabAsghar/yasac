import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';
import { Laptop, TabletSmartphone } from 'lucide-react';

const LandingPage = async () => {
  const user = await currentUser();
  if (user) redirect('/home');

  return (
    <section className='flex justify-center items-center w-full h-full gap-10 px-16 max-sm:flex-col-reverse max-sm:gap-16 max-[440px]:px-4'>
      <div className='flex flex-col gap-8 w-1/3 max-lg:w-1/2 max-sm:w-full max-sm:items-center'>
        <h1 className='text-light-1 text-heading1-bold max-lg:text-heading3-bold'>YASAC - Yet Another Social App Clone</h1>
        <div className='text-light-1 text-heading4-medium flex flex-col gap-3'>
          <p>Join a Community, Post a Thread, Connect with Friends.</p>
          <p>YASAC Welcomes You!</p>
        </div>
        <Link href='/sign-in' title='Login'
          className='left-sider-link w-fit flex items-center h-10 px-4 py-0 bg-primary-500 hover:bg-secondary-500' >
          <Laptop className='text-light-1 max-md:hidden' />
          <TabletSmartphone className='text-light-1 hidden max-md:block' />
          <p className='text-light-1 font-medium max-md:hidden max-sm:block max-[404px]:hidden'>
            Log in to Connect
          </p>
        </Link>
      </div>
      <div className=' flex items-center justify-center h-full w-2/3 max-lg:w-1/2 max-sm:w-full'>
        <iframe className='flex items-center justify-center w-full h-full overflow-hidden' title='Logo'
          src='/assets/connection.html'>
        </iframe>
      </div>
    </section>
  );
};

export default LandingPage;
