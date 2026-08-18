/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app'],
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add these for Vercel deployment
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'localhost'],
  },
  // Environment variables that should be available at build time
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
};

module.exports = nextConfig;