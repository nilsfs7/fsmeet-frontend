import '@/styles/globals.css';
import { Roboto } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import 'moment/locale/de';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

interface Props {
  Component: React.ComponentType<any>;
  pageProps: {
    session: any;
    [key: string]: any;
  };
}

const fontRoboto = Roboto({ subsets: ['latin'], weight: ['400'] });

const App = ({ Component, pageProps }: Props) => {
  return (
    <SessionProvider session={pageProps.session}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <main className={fontRoboto.className}>
          <Component {...pageProps} />
        </main>
      </LocalizationProvider>
    </SessionProvider>
  );
};

export default App;
