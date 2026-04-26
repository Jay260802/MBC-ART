import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  experimental: {
    // Reduces bundle size for icon-heavy packages on Tailwind v4 + Next 15
    optimizePackageImports: ["lucide-react", "motion"],
  },
};

export default nextConfig;
