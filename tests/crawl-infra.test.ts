import { afterEach, describe, expect, it, vi } from "vitest";
import type { MetadataRoute } from "next";
import { hasRemoteMatch } from "next/dist/shared/lib/match-remote-pattern";

import sitemap from "@/app/sitemap";
import { GET as rssFeed } from "@/app/blogs/rss.xml/route";
import { CLIENT_PROJECTS } from "@/components/client-work/content";
import articles from "@/data/articles.json";
import extracurricular from "@/data/extracurricular.json";
import { getAllNotes, getAllPosts, type Note, type Post } from "@/lib/blog";

vi.mock("@/lib/blog", () => ({
  getAllPosts: vi.fn(),
  getAllNotes: vi.fn(),
}));

const SITE = "https://www.arafatops.com";

function post(overrides: Partial<Post>): Post {
  return {
    slug: "a-post",
    category: "engineering",
    title: "A Post",
    description: "About a post.",
    date: "2026-08-10",
    tags: [],
    readTime: "1 min read",
    draft: false,
    cover: null,
    content: "",
    ...overrides,
  };
}

function note(date: string): Note {
  return {
    slug: `note-${date}`,
    title: "A Note",
    date,
    tags: [],
    readTime: "1 min read",
    draft: false,
    content: "",
  };
}

function byUrl(
  entries: MetadataRoute.Sitemap,
): Map<string, MetadataRoute.Sitemap[number]> {
  return new Map(entries.map((entry) => [entry.url, entry]));
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("sitemap", () => {
  it("should date blog URLs from their content and leave hand-authored pages undated", async () => {
    // Deliberately not newest-first: the dates must be derived, not positional.
    vi.mocked(getAllPosts).mockResolvedValue([
      post({ category: "engineering", slug: "older", date: "2026-08-10" }),
      post({ category: "security", slug: "newest", date: "2026-08-18" }),
      post({ category: "security", slug: "oldest", date: "2026-07-01" }),
    ]);
    vi.mocked(getAllNotes).mockResolvedValue([
      note("2026-05-01"),
      note("2026-06-05"),
    ]);

    const entries = await sitemap();
    const urls = byUrl(entries);
    const lastModified = (path: string): string | Date | undefined =>
      urls.get(`${SITE}${path}`)?.lastModified;

    expect(lastModified("/blogs/security/newest")).toBe("2026-08-18T00:00:00+06:00");
    expect(lastModified("/blogs/engineering/older")).toBe("2026-08-10T00:00:00+06:00");
    expect(lastModified("/blogs/security")).toBe("2026-08-18T00:00:00+06:00");
    expect(lastModified("/blogs/engineering")).toBe("2026-08-10T00:00:00+06:00");
    expect(lastModified("/blogs")).toBe("2026-08-18T00:00:00+06:00");
    expect(lastModified("/articles")).toBe("2026-08-18T00:00:00+06:00");
    expect(lastModified("/notes")).toBe("2026-06-05T00:00:00+06:00");

    for (const path of ["", "/about", "/faq", "/projects", "/contact"]) {
      expect(urls.has(`${SITE}${path}`)).toBe(true);
      expect(lastModified(path)).toBeUndefined();
    }
    for (const project of CLIENT_PROJECTS) {
      expect(urls.has(`${SITE}${project.detailPath}`)).toBe(true);
      expect(lastModified(project.detailPath)).toBeUndefined();
    }

    // 11 hand-listed pages + case studies + 2 categories + 3 posts.
    expect(entries).toHaveLength(11 + CLIENT_PROJECTS.length + 2 + 3);
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length);
    expect(entries.some((entry) => entry.url.includes("/blogs/tag/"))).toBe(false);
    for (const entry of entries) {
      expect(entry).not.toHaveProperty("changeFrequency");
      expect(entry).not.toHaveProperty("priority");
    }
  });

  it("should still list the static pages and log the failure when the blog fetch throws", async () => {
    const failure = new Error("supabase unreachable");
    vi.mocked(getAllPosts).mockRejectedValue(failure);
    vi.mocked(getAllNotes).mockResolvedValue([]);
    const logged = vi.spyOn(console, "error").mockImplementation(() => {});

    const entries = await sitemap();

    expect(entries).toHaveLength(11 + CLIENT_PROJECTS.length);
    expect(entries.map((entry) => entry.url)).toContain(`${SITE}/blogs`);
    expect(entries.every((entry) => entry.lastModified === undefined)).toBe(true);
    expect(logged).toHaveBeenCalledWith(expect.stringContaining("sitemap"), failure);
  });
});

describe("RSS feed", () => {
  it("should date the feed by its newest post and keep the XML well-formed", async () => {
    vi.mocked(getAllPosts).mockResolvedValue([
      post({
        category: "security",
        slug: "newest",
        date: "2026-08-18",
        title: "Fish & <Chips>\u0007",
        description: 'It\'s "quoted"',
      }),
      post({ category: "engineering", slug: "older", date: "2026-08-10" }),
    ]);

    const response = await rssFeed();
    const xml = await response.text();

    expect(response.headers.get("Content-Type")).toBe(
      "application/rss+xml; charset=utf-8",
    );
    expect(xml).toContain(
      "<lastBuildDate>Tue, 18 Aug 2026 00:00:00 GMT</lastBuildDate>",
    );
    expect(xml).toContain("<title>Fish &amp; &lt;Chips&gt;</title>");
    expect(xml).toContain(
      "<description>It&apos;s &quot;quoted&quot;</description>",
    );
    expect(xml).toContain(
      `<guid isPermaLink="true">${SITE}/blogs/security/newest</guid>`,
    );
    expect(xml).toContain("<pubDate>Mon, 10 Aug 2026 00:00:00 GMT</pubDate>");
    expect(xml.indexOf("/blogs/security/newest")).toBeLessThan(
      xml.indexOf("/blogs/engineering/older"),
    );
  });
});

describe("image optimizer allow-list", () => {
  it("should serve only the image sources the site actually renders", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project-ref.supabase.co");
    vi.resetModules();
    const { default: config } = await import("../next.config.mjs");
    const remotePatterns = config.images?.remotePatterns ?? [];
    const allowed = (url: string): boolean =>
      hasRemoteMatch([], remotePatterns, new URL(url));

    // The two data files whose remote images go through next/image without
    // `unoptimized`: the /articles carousel and the home ~/etc tiles.
    const optimized = [...articles, ...extracurricular]
      .map((item) => item.imageUrl)
      .filter((url) => url.startsWith("http"));
    expect(optimized.length).toBeGreaterThan(0);
    for (const url of optimized) {
      expect(allowed(url), url).toBe(true);
    }

    const storage = "https://project-ref.supabase.co/storage/v1/object/public";
    expect(allowed(`${storage}/blog-images/posts/a-post/cover.png`)).toBe(true);
    expect(allowed(`${storage}/other-bucket/cover.png`)).toBe(false);
    expect(allowed("https://attacker.example/huge.png")).toBe(false);
    expect(allowed("http://miro.medium.com/1*abc.png")).toBe(false);
  });
});
