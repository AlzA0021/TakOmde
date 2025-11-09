/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // حذف output: 'standalone' برای Vercel
  // فقط برای Docker نیاز است
  
  // غیرفعال کردن type checking در build (موقت)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // غیرفعال کردن ESLint در build (موقت)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // تنظیمات i18n برای فارسی
  i18n: {
    locales: ['fa', 'en'],
    defaultLocale: 'fa',
  },

  // تنظیمات تصاویر - به‌روز شده با remotePatterns
  images: {
    remotePatterns: [
      // Django backend در localhost
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      // Production API
      {
        protocol: 'https',
        hostname: 'api.yoursite.com',
        pathname: '/media/**',
      },
      // اگر از Vercel استفاده می‌کنید
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // حذف rewrites برای Vercel (باید از environment variables استفاده کنید)
  // در Vercel، API_URL را در Environment Variables تنظیم کنید
  
  // Headers برای CORS
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },

  // تنظیمات webpack (اختیاری)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },

  // محیط‌های متغیر
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
}

module.exports = nextConfig