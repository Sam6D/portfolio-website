import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The case-study-media route reads files from `protected-media/` using a
  // dynamically built path, so Next's build tracer can't detect the
  // dependency on its own - this makes sure those files are included in
  // the deployed function bundle.
  outputFileTracingIncludes: {
    '/api/case-study-media/carv/[...path]': ['./protected-media/carv/**/*'],
  },
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
      {
        // Password-protected case study: keep it out of search results.
        // The real protection is the auth check in src/middleware.ts;
        // this header is defense-in-depth.
        source: '/case-studies/carv/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, noimageindex',
          },
        ],
      },
      {
        source: '/case-study-locked',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, noimageindex',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
