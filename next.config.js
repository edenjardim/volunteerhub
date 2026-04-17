/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: { cacheName: 'google-fonts', expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 } },
    },
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
      handler: 'NetworkFirst',
      options: { cacheName: 'supabase-api', networkTimeoutSeconds: 10 },
    },
  ],
})

const nextConfig = {
  reactStrictMode: true,
  images: { domains: ['*.supabase.co', 'lh3.googleusercontent.com'] },
  experimental: { serverActions: { allowedOrigins: ['localhost:3000'] } },
}

module.exports = withPWA(nextConfig)
