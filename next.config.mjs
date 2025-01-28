/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.xoox.mn',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '500MB',
    },
  },
  async redirects() {
    return [
      {
        source: '/users/:id',
        missing: [
          {
            type: 'query',
            key: 'purchaseType',
            value: '\\d',
          },
        ],
        permanent: false,
        destination: '/users/:id?purchaseType=0',
      },
    ];
  },
};

export default nextConfig;
