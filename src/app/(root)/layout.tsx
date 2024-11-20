import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode, Suspense } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import { Toaster } from '@/components/ui/toaster';
import LeftSider from '@/components/shared/left-sider';
import RightSider from '@/components/shared/right-sider';
import { SpeedInsights } from '@vercel/speed-insights/next';
import DialogProvider from '@/core/context/dialog-provider';
import CustomDialog from '@/components/shared/custom-dialog';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YASAC',
  description: 'Yet Another Social App Clone built on Next.js',
};

const RootLayout = ({ children }: { children: ReactNode; }) => {
  return (
    <ClerkProvider>
      <DialogProvider>
        <html lang="en" className="custom-scrollbar">
          <body className={inter.className}>
            <Header />

            <main className="flex flex-row">
              <aside>
                <LeftSider />
              </aside>

              <section className="main-container">
                <div className='w-full h-full max-w-4xl'>
                  {children}

                  {/* Lazy load SpeedInsights */}
                  <Suspense fallback={null}>
                    <SpeedInsights />
                  </Suspense>
                </div>
              </section>

              <aside>
                <RightSider />
              </aside>
            </main>

            <CustomDialog />
            <Toaster />
            <Footer />
          </body>
        </html>
      </DialogProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
