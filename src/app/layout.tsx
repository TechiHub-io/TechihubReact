
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth'
import './globals.css';
import Footer from '@/(components)/shared/Footer';
import Header from '@/(components)/shared/Header';
import { ReactNode } from 'react';
import SessionWrapper from './SessionWrapper';

const poppins = Poppins({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Techihub',
  description: 'Connecting Tech Talents with Opportunities',
};

interface LayoutProps {
  children: ReactNode;
}

// @ts-ignore
const RootLayout = ({ children }:{children: ReactNode}) => {
  return (
    <html lang='en' className={poppins.className}>
        <body>
        <SessionWrapper>
          {children}
        </SessionWrapper>
        </body>
    </html>
  );
}

export default RootLayout;