/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['terminal.jup.ag', 'ipfs.io'],
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        pathname: '/512/**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
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
  // Configure security headers 
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://terminal.jup.ag https://*.jup.ag; style-src 'self' 'unsafe-inline' https://terminal.jup.ag https://*.jup.ag https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https: http:; connect-src 'self' https: wss:; frame-src 'self' https://terminal.jup.ag https://*.jup.ag;"
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ];
  }
}

module.exports = nextConfig
