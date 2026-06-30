import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['aniplay'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
      },
    ],
  },
};

export default nextConfig;
