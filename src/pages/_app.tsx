import LayoutPage from '@/components/LayoutPage';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <LayoutPage>
      <Component {...pageProps} />
    </LayoutPage>
  );
}
