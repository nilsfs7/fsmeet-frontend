import './globals.css';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import LocalizationProvider from '@/lib/providers';
import { AppShellColumn } from '@/components/layout/app-shell-column';
import { cn } from '@/lib/utils';
import { getSiteUrl } from '@/lib/site-url';

const fontRoboto = Roboto({ subsets: ['latin'], weight: ['400'] });

const siteDescription = 'Freestyle Football community and event platform. Discover events, athletes, and competitions worldwide.';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'FSMeet',
    template: '%s · FSMeet',
  },
  description: siteDescription,
  openGraph: {
    type: 'website',
    siteName: 'FSMeet',
    title: 'FSMeet',
    description: siteDescription,
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-dvh min-h-0 overflow-hidden">
      <body className={cn(fontRoboto.className, 'm-0 h-dvh min-h-0 overflow-hidden p-0')}>
        {/* Single height pass-through: providers (fragments) do not establish a % height for the shell. */}
        <div className="h-full min-h-0">
          <SessionProvider>
            <LocalizationProvider>
              <NextIntlClientProvider messages={messages}>
                <AppShellColumn>{children}</AppShellColumn>
              </NextIntlClientProvider>
            </LocalizationProvider>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
