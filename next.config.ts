import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['utfs.io'], // Add your image host here
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
