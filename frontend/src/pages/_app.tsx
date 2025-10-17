import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import Layout from '@/components/Layout/Layout';
import '@/styles/globals.css';
import { Vazirmatn } from 'next/font/google'

const vazir = Vazirmatn({
  subsets: ['arabic'],
  weight: ['400', '700'],
})

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
