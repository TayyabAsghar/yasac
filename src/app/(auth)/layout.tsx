import '../globals.css';
import { Metadata } from 'next';
import { dark } from '@clerk/themes';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/toaster';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
    title: 'YASAC',
    description: 'Yet Another Social App Clone built on Next.js'
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode; }) {
    return (
        <ClerkProvider appearance={{ baseTheme: dark }}>
            <html lang='en'>
                <body className={`${inter.className} bg-dark-1`}>
                    <div className='w-full flex justify-center items-center min-h-screen'>
                        {children}
                        <SpeedInsights />
                        <Toaster />
                    </div>
                </body>
            </html>
        </ClerkProvider>
    );
};
