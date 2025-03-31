/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['terminal.jup.ag', 'ipfs.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        port: '',
        pathname: '/512/**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  },
  experimental: {
    forceSwcTransforms: true,
  },
  // Exclude _archive directory from compilation
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/_archive/**'],
    };
    return config;
  },
  // Ensure static assets are copied
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,
  // Allow loading from terminal.jup.ag
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://terminal.jup.ag; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http:; connect-src 'self' https: wss:; font-src 'self' data:;"
          }
        ]
      }
    ];
  }
}

module.exports = nextConfig
