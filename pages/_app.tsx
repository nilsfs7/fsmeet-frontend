import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Poly } from 'next/font/google';

const poly = Poly({ subsets: ['latin'], weight: ['400'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={poly.className}>
      <Component {...pageProps} />
    </main>
  );
}
