import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Push The Bar Higher',
  description: 'A romantic learning platform and motivation portal.',
};

import Heartbeat from '../components/tracking/Heartbeat';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-neutral-50 flex flex-col`}>
        <Heartbeat />
        {children}
      </body>
    </html>
  );
}
