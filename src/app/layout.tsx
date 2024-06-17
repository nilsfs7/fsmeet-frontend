import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

const fontRoboto = Roboto({ subsets: ['latin'], weight: ['400'] });

export const metadata: Metadata = {
  title: 'FSMeet',
  description: 'Freestyle Football community and event tool.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fontRoboto.className}>{children}</body>
    </html>
  );
}
