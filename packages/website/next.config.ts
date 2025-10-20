import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd2w9rnfcy7mm78.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '**.are.na',
      },
    ],
  },
};

export default nextConfig;
