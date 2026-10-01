import type { Metadata } from "next";

export const SITE_URL = "https://www.arafatops.com";
export const SITE_NAME = "Easin Arafat";

const TITLE_SUFFIX = ` | ${SITE_NAME}`;
const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 160;
/** Site content is authored in Dhaka; date-only values are read as local midnight. */
const SITE_UTC_OFFSET = "+06:00";

/**
 * Next.js replaces `alternates` wholesale when a page sets its own, so the
 * RSS link has to travel with every page's canonical or it disappears.
 */
const RSS_ALTERNATE = {
  "application/rss+xml": [
    { url: "/blogs/rss.xml", title: "Easin Arafat - Blog RSS" },
  ],
};

/** Absolute URL for a site path. Home has no trailing slash. */
export function absoluteUrl(path = "/"): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

interface OgCard {
  title: string;
  category?: string;
  meta?: string;
  path?: string;
  prompt?: string;
}

/** Relative URL of the generated terminal-style social card (`/api/og`). */
export function ogImageUrl(card: OgCard): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(card)) {
    if (value) params.set(key, value);
  }
  return `/api/og?${params.toString()}`;
}

/** Trim text to a search-snippet-sized description, cutting at a word boundary. */
export function clampDescription(
  text: string,
  max = MAX_DESCRIPTION_LENGTH,
): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 3);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:!?-]+$/, "")}...`;
}

/**
 * Structured data wants a full ISO 8601 datetime with a timezone; Search
 * Console flags a bare `YYYY-MM-DD` as an invalid datetime value.
 */
export function isoDateTime(date: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? `${date}T00:00:00${SITE_UTC_OFFSET}`
    : date;
}

export interface PageSeo {
  /** Page title without the brand suffix. */
  title: string;
  description: string;
  /** Site path starting with "/", e.g. "/projects". */
  path: string;
  /** Explicit social image; defaults to the generated card. */
  ogImage?: string;
  /** Overrides for the generated card (ignored when `ogImage` is set). */
  ogCard?: Partial<Omit<OgCard, "title">>;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  /** Thin or utility page: keep out of the index but let links be followed. */
  noindex?: boolean;
}

/**
 * Complete page metadata. Next.js shallow-merges metadata, so a page that
 * sets only part of `openGraph`/`twitter`/`alternates` silently drops the
 * rest (social image, RSS link) - build every block in full here instead.
 */
export function pageMetadata(seo: PageSeo): Metadata {
  const url = absoluteUrl(seo.path);
  const description = clampDescription(seo.description);
  const image =
    seo.ogImage ??
    ogImageUrl({
      title: seo.title,
      category: "portfolio",
      path: seo.path.replace(/^\//, "") || "home",
      ...seo.ogCard,
    });
  const brandFits =
    !seo.title.includes(SITE_NAME) &&
    seo.title.length + TITLE_SUFFIX.length <= MAX_TITLE_LENGTH;

  return {
    // Absolute on purpose: a parent layout that sets a plain string title
    // resets the root `%s | Easin Arafat` template for everything below it.
    title: { absolute: brandFits ? `${seo.title}${TITLE_SUFFIX}` : seo.title },
    description,
    alternates: { canonical: url, types: RSS_ALTERNATE },
    openGraph: {
      title: seo.title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: seo.type ?? "website",
      // Only the generated card has known dimensions; an explicit image
      // (e.g. a screenshot) must not be declared with a size it does not have.
      images: [
        seo.ogImage
          ? { url: image, alt: seo.title }
          : { url: image, width: 1200, height: 630, alt: seo.title },
      ],
      ...(seo.publishedTime && { publishedTime: seo.publishedTime }),
      ...(seo.modifiedTime && { modifiedTime: seo.modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description,
      images: [image],
    },
    ...(seo.noindex && { robots: { index: false, follow: true } }),
  };
}
