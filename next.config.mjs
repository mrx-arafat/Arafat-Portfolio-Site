/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // AVIF first: smaller than WebP for the same quality; browsers that
    // cannot decode it fall through to WebP.
    formats: ['image/avif', 'image/webp'],
    // Optimized images inherit this TTL (31 days) instead of Next's 60s
    // default, so /_next/image responses stay cached at the edge.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  compress: true,
  async headers() {
    // Files under /public otherwise ship with max-age=0 on Vercel and get
    // revalidated on every visit. Fonts and JS chunks under /_next/static
    // are already immutable.
    const longCache = [
      {
        key: "Cache-Control",
        value: "public, max-age=2678400, stale-while-revalidate=86400",
      },
    ];
    return [
      { source: "/images/:path*", headers: longCache },
      { source: "/sounds/:path*", headers: longCache },
      { source: "/favicon.png", headers: longCache },
    ];
  },
  async redirects() {
    return [
      {
        source: "/about-me",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/blogs",
        permanent: true,
      },
      {
        source: "/blog/:path*",
        destination: "/blogs/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "profile.arafatops.com" }],
        destination: "https://www.arafatops.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "arafatops.com" }],
        destination: "https://www.arafatops.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
