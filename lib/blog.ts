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

export const CATEGORIES = [
  "security",
  "engineering",
  "business",
  "psychology",
  "life",
] as const;
export type CategoryName = (typeof CATEGORIES)[number];

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

/** Compute "N min read" from raw text at 200 wpm, floor 1. */
export function computeReadTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
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
