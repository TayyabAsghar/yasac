import '../globals.css';
import { Metadata } from 'next';
import { dark } from '@clerk/themes';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { SpeedInsights } from '@vercel/speed-insights/next';
import PageHeader from '@/components/shared/landing-page/page-header';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'YASAC',
    description: 'Yet Another Social App Clone built on Next.js'
};

const inter = Inter({ subsets: ['latin'] });

const RootLayout = ({ children }: { children: React.ReactNode; }) => {
    return (
        <ClerkProvider appearance={{ baseTheme: dark }}>
            <html lang='en'>
                <body className={inter.className}>
                    <PageHeader />
                    <main className='flex flex-row'>
                        <section className='main-container'>
                            <div className='w-full h-full'>
                                {children}

                                {/* Lazy load SpeedInsights */}
                                <Suspense fallback={null}>
                                    <SpeedInsights />
                                </Suspense>
                            </div>
                        </section>
                    </main>
                </body>
            </html>
        </ClerkProvider>
    );
};

export default RootLayout;
