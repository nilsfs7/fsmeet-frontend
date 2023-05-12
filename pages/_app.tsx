import '@/styles/globals.css';
import { Arvo } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'moment/locale/de';

interface Props {
  Component: React.ComponentType<any>;
  pageProps: {
    session: any;
    [key: string]: any;
  };
}

const baseFont = Arvo({ subsets: ['latin'], weight: ['400'] });

export default function App({ Component, pageProps }: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="de">
      <SessionProvider session={pageProps.session}>
        <main className={baseFont.className}>
          <Component {...pageProps} />
        </main>
      </SessionProvider>
    </LocalizationProvider>
  );
}
