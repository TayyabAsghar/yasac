import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import LeftSider from '@/components/shared/left-sider';
import RightSider from '@/components/shared/right-sider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YASAC',
  description: 'Yet Another Social App Clone built on Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Header />
          <main className='flex flex-row'>
            <LeftSider />
            <section className='main-container'>
              <div className='w-full max-w-4xl'>
                {children}
              </div>
            </section>
            <RightSider />
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
