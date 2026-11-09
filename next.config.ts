import type { NextConfig } from "next";

const apiOrigin = process.env.API_INTERNAL_URL || 'http://127.0.0.1:4000';
if (process.env.NETLIFY && (!process.env.API_INTERNAL_URL || new URL(apiOrigin).protocol !== 'https:')) {
  throw new Error('Netlify requires API_INTERNAL_URL pointing to the approved HTTPS backend');
}

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  devIndicators: false,
  output: process.env.NETLIFY ? undefined : 'standalone',
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${apiOrigin.replace(/\/$/, '')}/api/:path*` }];
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
