import './globals.css';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import LocalizationProvider from '@/lib/providers';
import { AppShellColumn } from '@/components/layout/app-shell-column';
import { cn } from '@/lib/utils';

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
