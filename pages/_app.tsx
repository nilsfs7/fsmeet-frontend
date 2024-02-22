import '@/styles/globals.css';
import { Roboto } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import 'moment/locale/de';

interface Props {
  Component: React.ComponentType<any>;
  pageProps: {
    session: any;
    [key: string]: any;
  };
}

const fontRoboto = Roboto({ subsets: ['latin'], weight: ['400'] });

export default function App({ Component, pageProps }: Props) {
  return (
    <SessionProvider session={pageProps.session}>
      <main className={fontRoboto.className}>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}
