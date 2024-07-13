
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth'
import './globals.css';
import Footer from '@/(components)/shared/Footer';
import Header from '@/(components)/shared/Header';

const poppins = Poppins({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Techihub',
  description: 'Connecting Tech Talents with Opportunities',
};

export default function RootLayout({
  session, children
}: Readonly<{
  session: Session | null
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={poppins.className}>
        <body>
        <SessionProvider session={session}>
          {/* <Header /> */}
          {children}
          {/* <Footer /> */}
        </SessionProvider>
        </body>
    </html>
  );
}
