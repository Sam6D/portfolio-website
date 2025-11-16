import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lastfm.freetls.fastly.net',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
    ],
  },
  async headers() {
    return [
      {
        // Block image indexing for all images in /images/ directory
        source: '/images/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noimageindex, noindex',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
