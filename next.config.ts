import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  devIndicators: false,
  output: process.env.NETLIFY ? undefined : 'standalone',
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${process.env.API_INTERNAL_URL || 'http://127.0.0.1:4000'}/api/:path*` }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
