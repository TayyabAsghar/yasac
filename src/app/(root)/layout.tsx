import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import { Toaster } from '@/components/ui/toaster';
import LeftSider from '@/components/shared/left-sider';
import RightSider from '@/components/shared/right-sider';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YASAC',
  description: 'Yet Another Social App Clone built on Next.js',
};

const RootLayout = ({ children }: { children: React.ReactNode; }) => {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={inter.className}>
          <Header />
          <main className='flex flex-row'>
            <LeftSider />
            <section className='main-container'>
              <div className='w-full h-full max-w-4xl'>
                {children}
                <SpeedInsights />
              </div>
            </section>
            <RightSider />
          </main>
          <Toaster />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
