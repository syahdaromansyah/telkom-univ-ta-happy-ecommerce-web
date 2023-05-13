import LayoutPage from '@/components/LayoutPage';
import { setupStore } from '@/redux-app/redux-store/store';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider as ReduxProvider } from 'react-redux';

export default function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={setupStore()}>
      <LayoutPage>
        <Component {...pageProps} />
      </LayoutPage>
    </ReduxProvider>
  );
}
