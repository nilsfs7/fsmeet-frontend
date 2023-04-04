import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Arvo } from 'next/font/google';

const baseFont = Arvo({ subsets: ['latin'], weight: ['400'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={baseFont.className}>
      <Component {...pageProps} />
    </main>
  );
}
