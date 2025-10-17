import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fa" dir="rtl" suppressHydrationWarning>
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#009f7f" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body suppressHydrationWarning>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
