import '@/styles/globals.css';
import { Arvo } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';

interface Props {
  Component: React.ComponentType<any>;
  pageProps: {
    session: any;
    [key: string]: any;
  };
}

const baseFont = Arvo({ subsets: ['latin'], weight: ['400'] });

export default function App({ Component, pageProps }: Props) {
  const { session, ...rest } = pageProps;

  return (
    <SessionProvider session={session}>
      <main className={baseFont.className}>
        <Component {...rest} />
      </main>
    </SessionProvider>
  );
}
