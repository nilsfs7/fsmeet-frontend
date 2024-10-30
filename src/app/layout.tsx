import './globals.css';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import LocalizationProvider from '@/lib/providers';

const fontRoboto = Roboto({ subsets: ['latin'], weight: ['400'] });

export const metadata: Metadata = {
  title: 'FSMeet',
  description: 'Freestyle Football community and event tool.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={fontRoboto.className}>
        <SessionProvider>
          <LocalizationProvider>
            <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
          </LocalizationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
