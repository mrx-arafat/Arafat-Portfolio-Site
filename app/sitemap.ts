import type { MetadataRoute } from "next";
import { CLIENT_PROJECTS } from "@/components/client-work/content";
import { getAllNotes, getAllPosts, type Note, type Post } from "@/lib/blog";
import { PORTRAIT_URL, absoluteUrl, isoDateTime } from "@/lib/seo";

// Rendered per request, never prerendered. With `revalidate = 3600` Vercel kept
// serving the build-time sitemap for over a week, ignoring both the timer and
// revalidatePath("/sitemap.xml") from the publish API, so new posts never
// reached it. Crawlers fetch it a few times a day; one query each is cheap.
export const dynamic = "force-dynamic";

/** Newest `YYYY-MM-DD` date in a list, or undefined when the list is empty. */
function newestDate(dates: string[]): string | undefined {
  return dates.reduce<string | undefined>(
    (newest, date) => (newest === undefined || date > newest ? date : newest),
    undefined,
  );
}

/**
 * One sitemap entry. `lastModified` is set only when `date` comes from the
 * content itself: Google trusts lastmod only while it is consistently
 * accurate, so a page with no real modification date carries none rather
 * than a build or request timestamp. The date-only value is passed through
 * as a site-local datetime string, never as a Date, so serialising it cannot
 * move it across a day boundary.
 */
function entry(path: string, date?: string): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    ...(date && { lastModified: isoDateTime(date) }),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: Post[] = [];
  let notes: Note[] = [];
  try {
    [posts, notes] = await Promise.all([getAllPosts(), getAllNotes()]);
  } catch (error) {
    // Resilient on purpose: a sitemap without the blog section beats a 500.
    console.error(
      "[sitemap] blog content unavailable, listing static pages only",
      error,
    );
  }

  const newestPost = newestDate(posts.map((post) => post.date));
  const postDatesByCategory = new Map<string, string[]>();
  for (const post of posts) {
    const dates = postDatesByCategory.get(post.category) ?? [];
    dates.push(post.date);
    postDatesByCategory.set(post.category, dates);
  }

  return [
    { ...entry("/"), images: [PORTRAIT_URL] },
    { ...entry("/about"), images: [PORTRAIT_URL] },
    entry("/faq"),
    entry("/projects"),
    ...CLIENT_PROJECTS.map((project) => entry(project.detailPath)),
    entry("/security-research"),
    entry("/featured"),
    entry("/articles", newestPost),
    entry("/blogs", newestPost),
    entry("/notes", newestDate(notes.map((note) => note.date))),
    entry("/skills"),
    entry("/contact"),
    ...Array.from(postDatesByCategory, ([category, dates]) =>
      entry(`/blogs/${category}`, newestDate(dates)),
    ),
    ...posts.map((post) =>
      entry(`/blogs/${post.category}/${post.slug}`, post.date),
    ),
  ];
}
