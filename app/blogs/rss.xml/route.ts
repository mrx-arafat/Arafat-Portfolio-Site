import { getAllPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

/** Characters XML 1.0 cannot carry at all, even escaped (control codes, lone surrogates). */
const XML_INVALID_CHARS =
  /[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/gu;

function escapeXml(text: string): string {
  return text
    .replace(XML_INVALID_CHARS, "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/** RFC 822 date for a `YYYY-MM-DD` post date (read as UTC, so the day never shifts). */
function rfc822(date: string): string {
  return new Date(date).toUTCString();
}

export async function GET(): Promise<Response> {
  const posts = await getAllPosts();

  // The feed changes when a post is published, not when it is requested.
  const newestDate = posts.reduce(
    (newest, post) => (post.date > newest ? post.date : newest),
    "",
  );
  const lastBuildDate = newestDate
    ? `\n    <lastBuildDate>${rfc822(newestDate)}</lastBuildDate>`
    : "";

  const items = posts
    .map((post) => {
      const url = escapeXml(absoluteUrl(`/blogs/${post.category}/${post.slug}`));
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <category>${escapeXml(post.category)}</category>
      <pubDate>${rfc822(post.date)}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Easin Arafat - Blog</title>
    <link>${absoluteUrl("/blogs")}</link>
    <description>Security research, engineering, business, psychology, and life - essays by Easin Arafat.</description>
    <language>en</language>${lastBuildDate}
    <atom:link href="${absoluteUrl("/blogs/rss.xml")}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
