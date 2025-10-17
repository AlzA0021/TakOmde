import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import Layout from '@/components/Layout/Layout';
import '@/styles/globals.css';
import localFont from 'next/font/local';

const vazir = localFont({
  src: [
    {
      path: '../fonts/Vazir-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Vazir-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-vazir',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${vazir.variable} font-sans`}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            direction: 'rtl',
            fontFamily: 'var(--font-vazir)',
          },
        }}
      />
    </div>
  );
}
