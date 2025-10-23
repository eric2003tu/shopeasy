import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn.dummyjson.com', 'i.dummyjson.com', 'dummyjson.com'],
  },
  // Ignore ESLint during production builds to prevent warnings from failing the build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
