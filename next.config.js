/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['terminal.jup.ag'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        port: '',
        pathname: '/512/**',
      },
    ],
  },
  experimental: {
    forceSwcTransforms: true,
  },
}

module.exports = nextConfig
