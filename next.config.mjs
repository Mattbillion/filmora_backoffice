/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['xoox.mn.s3.us-west-1.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.ap-southeast-1.amazonaws.com',
        pathname: '/xoox.mn/**',
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-1.amazonaws.com',
        pathname: '/xoox.mn/**',
      },

      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'xoox-project.s3.ap-southeast-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
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
};

export default nextConfig;
