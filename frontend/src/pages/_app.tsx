import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Layout from '@/components/Layout/Layout';
import '@/styles/globals.css';
import localFont from 'next/font/local';

const estedad = localFont({
  src: [
    {
      path: '../../public/fonts/Estedad-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Estedad-ExtraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Estedad-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Estedad-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Estedad-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Estedad-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Estedad-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Estedad-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Estedad-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-estedad',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`${estedad.variable} font-sans`} suppressHydrationWarning>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            direction: 'rtl',
            fontFamily: 'var(--font-estedad)',
          },
        }}
      />
    </div>
  );
}
