import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // /api/og stays crawlable - it serves the OG/social card images
        allow: ["/", "/api/og"],
        disallow: ["/api/", "/private/"],
      },
    ],
    sitemap: "https://www.arafatops.com/sitemap.xml",
  };
}
