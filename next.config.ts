import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/browser',
  images: {
    remotePatterns: [new URL('https://placehold.co/**')],
  },
};

export default nextConfig;
