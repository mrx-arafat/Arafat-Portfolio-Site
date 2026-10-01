const CANONICAL_ORIGIN = "https://www.arafatops.com";

// Hosts that reach this app but are not the canonical one.
const ALIAS_HOSTS = ["profile.arafatops.com", "arafatops.com"];

// Paths that moved. Kept in one list so an old path on an alias host can be
// sent straight to its final URL instead of hopping host first, path second.
const MOVED_PATHS = [
  { source: "/about-me", destination: "/about" },
  { source: "/dashboard", destination: "/" },
  { source: "/blog", destination: "/blogs" },
  { source: "/blog/:path*", destination: "/blogs/:path*" },
];

// Remote hosts whose images are rendered through next/image (and therefore
// fetched by the optimizer): data/articles.json and data/extracurricular.json.
// tests/crawl-infra.test.ts fails when a data file adds a host missing here.
const REMOTE_IMAGE_HOSTS = [
  "miro.medium.com",
  "encrypted-tbn0.gstatic.com",
  "t4.ftcdn.net",
  "img.freepik.com",
  "isomer-user-content.by.gov.sg",
  "media.licdn.com",
  "www.newagebd.com",
];

// Post covers are uploaded to the public blog-images bucket of the Supabase
// project (see app/api/blog/publish).
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // AVIF first: smaller than WebP for the same quality; browsers that
    // cannot decode it fall through to WebP.
    formats: ['image/avif', 'image/webp'],
    // Optimized images inherit this TTL (31 days) instead of Next's 60s
    // default, so /_next/image responses stay cached at the edge.
    minimumCacheTTL: 2678400,
    // An explicit allow-list: a wildcard host would let anyone use this
    // site's optimizer as an open image proxy.
    remotePatterns: [
      ...REMOTE_IMAGE_HOSTS.map((hostname) => ({ protocol: "https", hostname })),
      ...(supabaseHost
        ? [
            {
              protocol: "https",
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/blog-images/**",
            },
          ]
        : []),
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
    // Alias-host rules come first and already apply the moved paths, so
    // https://profile.arafatops.com/blog/x reaches /blogs/x on the canonical
    // host in one hop.
    const toCanonicalHost = ALIAS_HOSTS.flatMap((host) =>
      [...MOVED_PATHS, { source: "/:path*", destination: "/:path*" }].map(
        ({ source, destination }) => ({
          source,
          has: [{ type: "host", value: host }],
          destination: `${CANONICAL_ORIGIN}${destination}`,
          permanent: true,
        }),
      ),
    );
    return [
      ...toCanonicalHost,
      ...MOVED_PATHS.map((moved) => ({ ...moved, permanent: true })),
    ];
  },
};

export default nextConfig;
