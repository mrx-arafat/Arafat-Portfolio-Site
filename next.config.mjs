/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
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
