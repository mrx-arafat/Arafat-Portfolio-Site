import { cookies, draftMode } from "next/headers";
import { supabasePublic, supabaseAdmin } from "./supabase";

/** Cookie naming which single post a preview link authorized (see /api/blog/preview). */
export const PREVIEW_COOKIE = "blog_preview_target";

/** Cookie value identifying one post — keeps a preview link scoped to that post only. */
export function previewTargetKey(
  type: "essay" | "note",
  category: string | null,
  slug: string
): string {
  return `${type}:${category ?? ""}:${slug}`;
}

/**
 * True when Next.js Draft Mode is enabled for this request (preview cookie set
 * by /api/blog/preview). Guarded so build-time/static contexts — where
 * draftMode() is unavailable — safely fall back to published-only reads.
 */
export async function isPreviewMode(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}

/**
 * The specific post the current preview cookie authorizes, or null.
 * Scoped per-post so one preview link can't expose every other draft on the site.
 */
async function authorizedPreviewTarget(): Promise<string | null> {
  try {
    const { isEnabled } = await draftMode();
    if (!isEnabled) return null;
    const store = await cookies();
    return store.get(PREVIEW_COOKIE)?.value ?? null;
  } catch {
    return null;
  }
}

const CATEGORY_SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Categories aren't a fixed list — publishing a post under a new category
 * creates it. Only the slug shape (lowercase, hyphen-separated) is enforced,
 * since the category is used directly as a URL segment.
 */
export function isValidCategorySlug(category: string): boolean {
  return CATEGORY_SLUG_RE.test(category);
}

export interface Post {
  slug: string;
  category: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readTime: string;
  draft: boolean;
  cover: string | null;
  content: string;
}

export interface Note {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  readTime: string;
  draft: boolean;
  content: string;
}

export interface Category {
  name: string;
  count: number;
}

/** Raw row shape of the posts table. */
export interface PostRow {
  type: "essay" | "note";
  category: string | null;
  slug: string;
  title: string;
  description: string;
  content_md: string;
  tags: string[];
  date: string;
  draft: boolean;
  cover_url: string | null;
}

/** Whitespace-separated word count of raw text. */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Compute "N min read" from raw text at 200 wpm, floor 1. */
export function computeReadTime(text: string): string {
  const minutes = Math.max(1, Math.round(countWords(text) / 200));
  return `${minutes} min read`;
}

/** Reader-facing copy for a category page. */
export interface CategoryInfo {
  /** Human name, e.g. "Engineering". */
  label: string;
  /** Page title without the brand suffix, e.g. "Engineering Essays". */
  title: string;
  /** One-line summary shown under the category heading. */
  tagline: string;
  /** Search-snippet description (120-160 chars). */
  description: string;
}

const CATEGORY_INFO: Record<string, CategoryInfo> = {
  engineering: {
    label: "Engineering",
    title: "Engineering Essays",
    tagline:
      "Engineering essays on system design, performance, DevOps and AI tooling.",
    description:
      "Engineering essays by Easin Arafat on system design and performance at scale, latency debugging, Nginx, CI/CD with GitHub Actions, MCP and AI coding agents.",
  },
  security: {
    label: "Security",
    title: "Security Research Essays",
    tagline:
      "Security research essays on vulnerabilities, exploitability and AI agent safety.",
    description:
      "Security research essays by Easin Arafat: WordPress CVE analysis, how exploitable a vulnerability really is, and what AI agents do when given server access.",
  },
  business: {
    label: "Business",
    title: "Business Essays",
    tagline:
      "Business essays on the tech industry, AI spending and the future of work.",
    description:
      "Business essays by Easin Arafat on the tech industry: AI spending, layoffs and the future of work, with sourced numbers behind the headlines.",
  },
  life: {
    label: "Life",
    title: "Life Essays",
    tagline: "Essays on life, logical thinking, mental models and reasoning.",
    description:
      "Essays on life by Easin Arafat: logical thinking, mental models and philosophy, and which reasoning habits actually matter in everyday decisions.",
  },
  psychology: {
    label: "Psychology",
    title: "Psychology Essays",
    tagline: "Psychology essays on confidence, purpose, influence and power.",
    description:
      "Psychology essays by Easin Arafat on confidence, people-pleasing, purpose, influence and the psychology of power, written as blunt, practical rules.",
  },
};

/**
 * Copy for a category page. Categories are open-ended (see
 * isValidCategorySlug), so an unknown slug gets generic copy built from its
 * humanized name instead of failing.
 */
export function getCategoryInfo(category: string): CategoryInfo {
  if (Object.hasOwn(CATEGORY_INFO, category)) return CATEGORY_INFO[category];
  const label = category
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const topic = label.toLowerCase();
  return {
    label,
    title: `${label} Essays`,
    tagline: `Essays on ${topic} by Easin Arafat.`,
    description: `Essays on ${topic} by Easin Arafat, an application security engineer writing about software, security and how things actually work. Newest posts first.`,
  };
}

/** Map a posts row to a Post (essays). */
export function mapPost(row: PostRow): Post {
  return {
    slug: row.slug,
    category: row.category ?? "",
    title: row.title,
    description: row.description,
    date: row.date,
    tags: row.tags ?? [],
    readTime: computeReadTime(row.content_md),
    draft: row.draft,
    cover: row.cover_url,
    content: row.content_md,
  };
}

/** Map a posts row to a Note. */
export function mapNote(row: PostRow): Note {
  return {
    slug: row.slug,
    title: row.title,
    date: row.date,
    tags: row.tags ?? [],
    readTime: computeReadTime(row.content_md),
    draft: row.draft,
    content: row.content_md,
  };
}

export const ROW_COLUMNS =
  "type, category, slug, title, description, content_md, tags, date, draft, cover_url";

/** All published essays, newest first. */
export async function getAllPosts(): Promise<Post[]> {
  const { data, error } = await supabasePublic()
    .from("posts")
    .select(ROW_COLUMNS)
    .eq("type", "essay")
    .eq("draft", false)
    .order("date", { ascending: false });
  if (error) throw error;
  return (data as PostRow[]).map(mapPost);
}

/**
 * Single essay by category + slug, null if missing.
 * Published-only by default. Bypasses the draft filter (via the admin client,
 * skipping RLS) only when the request's preview cookie authorizes this exact
 * post — a preview link for one draft must not expose every other draft.
 */
export async function getPost(
  category: string,
  slug: string
): Promise<Post | null> {
  const target = await authorizedPreviewTarget();
  const authorized = target === previewTargetKey("essay", category, slug);
  const client = authorized ? supabaseAdmin() : supabasePublic();
  let query = client
    .from("posts")
    .select(ROW_COLUMNS)
    .eq("type", "essay")
    .eq("category", category)
    .eq("slug", slug);
  if (!authorized) query = query.eq("draft", false);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data ? mapPost(data as PostRow) : null;
}

/** Adjacent published posts around (category, slug); both null if the post isn't published (e.g. draft preview). */
export function getAdjacentPosts(
  published: Post[],
  category: string,
  slug: string
): { older: Post | null; newer: Post | null } {
  const index = published.findIndex((p) => p.category === category && p.slug === slug);
  if (index === -1) return { older: null, newer: null };
  return {
    newer: index > 0 ? published[index - 1] : null,
    older: index < published.length - 1 ? published[index + 1] : null,
  };
}

/**
 * Posts to link from a post page, best match first: most shared tags, then
 * same category, newest first (`published` is already newest first).
 *
 * Leftover slots go to unrelated posts, taken by how close they were
 * published to `current` rather than by recency: filling with the newest
 * posts would point every page at the same few and leave older posts with no
 * inbound links at all.
 *
 * Posts in `avoid` (already linked elsewhere on the page, e.g. older/newer)
 * are used only when nothing else is left. Never includes `current`.
 */
export function getRelatedPosts(
  published: Post[],
  current: Pick<Post, "category" | "slug" | "tags">,
  { avoid = [], limit = 3 }: { avoid?: (Post | null)[]; limit?: number } = {}
): Post[] {
  const key = (p: Pick<Post, "category" | "slug">): string => `${p.category}/${p.slug}`;
  const avoided = new Set(avoid.filter((p): p is Post => p !== null).map(key));
  const tags = new Set(current.tags);
  // -1 for an unpublished draft preview, which makes "closest" mean newest.
  const currentIndex = published.findIndex((p) => key(p) === key(current));

  return published
    .map((post, index) => {
      const sharedTags = post.tags.filter((tag) => tags.has(tag)).length;
      const sameCategory = post.category === current.category;
      return {
        post,
        index,
        avoided: avoided.has(key(post)),
        sharedTags,
        sameCategory,
        rank: sharedTags > 0 || sameCategory ? index : Math.abs(index - currentIndex),
      };
    })
    .filter(({ post }) => key(post) !== key(current))
    .sort(
      (a, b) =>
        Number(a.avoided) - Number(b.avoided) ||
        b.sharedTags - a.sharedTags ||
        Number(b.sameCategory) - Number(a.sameCategory) ||
        a.rank - b.rank ||
        a.index - b.index
    )
    .slice(0, limit)
    .map(({ post }) => post);
}

/** All published notes, newest first. */
export async function getAllNotes(): Promise<Note[]> {
  const { data, error } = await supabasePublic()
    .from("posts")
    .select(ROW_COLUMNS)
    .eq("type", "note")
    .eq("draft", false)
    .order("date", { ascending: false });
  if (error) throw error;
  return (data as PostRow[]).map(mapNote);
}

/** Categories having at least one published essay, with counts. */
export async function getCategories(): Promise<Category[]> {
  const posts = await getAllPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
}

/** Published essays carrying the given tag. */
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const { data, error } = await supabasePublic()
    .from("posts")
    .select(ROW_COLUMNS)
    .eq("type", "essay")
    .eq("draft", false)
    .contains("tags", [tag])
    .order("date", { ascending: false });
  if (error) throw error;
  return (data as PostRow[]).map(mapPost);
}

/** All unique tags across published essays. */
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = new Set<string>();
  for (const post of posts) post.tags.forEach((t) => tags.add(t));
  return Array.from(tags).sort();
}

/**
 * Every cached route that shows a post or note, so publishing can refresh
 * them at once instead of waiting out each route's revalidate timer.
 */
export function blogRevalidationPaths(
  category: string | null,
  slug: string,
): string[] {
  const paths = ["/", "/blogs", "/articles", "/notes", "/sitemap.xml", "/blogs/rss.xml"];
  if (category) {
    paths.push(`/blogs/${category}`, `/blogs/${category}/${slug}`);
  }
  return paths;
}
