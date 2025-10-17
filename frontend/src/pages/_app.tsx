import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Layout from '@/components/Layout/Layout';
import '@/styles/globals.css';
import { Vazirmatn } from 'next/font/google';

const vazir = Vazirmatn({
  subsets: ['arabic'],
  weight: ['400', '700'],
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
    <div className={`${vazir.variable} font-sans`} suppressHydrationWarning>
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
