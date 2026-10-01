import { describe, expect, it } from "vitest";

import {
  absoluteUrl,
  clampDescription,
  isoDateTime,
  ogImageUrl,
  pageMetadata,
} from "@/lib/seo";

describe("SEO metadata helpers", () => {
  it("should build a self-referencing canonical with a complete social card", () => {
    const meta = pageMetadata({
      title: "Projects",
      description: "Security tools and infrastructure projects.",
      path: "/projects",
    });

    expect(meta.title).toEqual({ absolute: "Projects | Easin Arafat" });
    expect(meta.alternates?.canonical).toBe("https://www.arafatops.com/projects");
    expect(meta.openGraph).toMatchObject({
      title: "Projects",
      url: "https://www.arafatops.com/projects",
      siteName: "Easin Arafat",
    });
    expect(meta.openGraph?.images).toEqual([
      {
        url: "/api/og?title=Projects&category=portfolio&path=projects",
        width: 1200,
        height: 630,
        alt: "Projects",
      },
    ]);
    expect(meta.twitter).toMatchObject({
      card: "summary_large_image",
      images: ["/api/og?title=Projects&category=portfolio&path=projects"],
    });
  });

  it("should keep RSS autodiscovery when a page sets its own canonical", () => {
    const meta = pageMetadata({ title: "Blog", description: "Essays.", path: "/blogs" });

    expect(meta.alternates?.types).toEqual({
      "application/rss+xml": [
        { url: "/blogs/rss.xml", title: "Easin Arafat - Blog RSS" },
      ],
    });
  });

  it("should drop the brand suffix when it would push the title past 60 characters", () => {
    const longTitle = "Serve Static Files with Nginx Without Breaking Your MIME Types";
    const meta = pageMetadata({ title: longTitle, description: "d", path: "/x" });

    expect(meta.title).toEqual({ absolute: longTitle });
  });

  it("should not repeat the brand when the title already names it", () => {
    const meta = pageMetadata({
      title: "About Easin Arafat",
      description: "d",
      path: "/about",
    });

    expect(meta.title).toEqual({ absolute: "About Easin Arafat" });
  });

  it("should mark a page noindex,follow when asked", () => {
    const meta = pageMetadata({
      title: "#influence",
      description: "d",
      path: "/blogs/tag/influence",
      noindex: true,
    });

    expect(meta.robots).toEqual({ index: false, follow: true });
  });

  it("should prefer an explicit social image over the generated card", () => {
    const meta = pageMetadata({
      title: "TermStream",
      description: "d",
      path: "/projects/client-work/termstream",
      ogImage: "/images/client-work/termstream-overview.png",
    });

    expect(meta.openGraph?.images).toEqual([
      { url: "/images/client-work/termstream-overview.png", alt: "TermStream" },
    ]);
  });

  it("should clamp a description at a word boundary within 160 characters", () => {
    const long = `${"word ".repeat(40)}end`;
    const clamped = clampDescription(long);

    expect(clamped.length).toBeLessThanOrEqual(160);
    expect(clamped.endsWith("word...")).toBe(true);
    expect(clampDescription("Short and complete.")).toBe("Short and complete.");
  });

  it("should expand a date-only value into a timezone-qualified datetime", () => {
    expect(isoDateTime("2026-07-27")).toBe("2026-07-27T00:00:00+06:00");
    expect(isoDateTime("2026-07-27T10:15:00Z")).toBe("2026-07-27T10:15:00Z");
  });

  it("should resolve site paths to absolute URLs without a trailing slash on home", () => {
    expect(absoluteUrl()).toBe("https://www.arafatops.com");
    expect(absoluteUrl("/faq")).toBe("https://www.arafatops.com/faq");
    expect(ogImageUrl({ title: "A & B", category: "security" })).toBe(
      "/api/og?title=A+%26+B&category=security",
    );
  });
});
