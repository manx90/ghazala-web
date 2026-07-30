import type { NextConfig } from 'next';
import { SECURITY_HEADERS } from './src/config/security-headers';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns', '@tanstack/react-table'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [...SECURITY_HEADERS],
      },
    ];
  },
};

export default nextConfig;
