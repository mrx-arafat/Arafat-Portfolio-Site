import { supabasePublic } from "./supabase";

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

const ROW_COLUMNS =
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

/** Single published essay by category + slug, null if missing. */
export async function getPost(
  category: string,
  slug: string
): Promise<Post | null> {
  const { data, error } = await supabasePublic()
    .from("posts")
    .select(ROW_COLUMNS)
    .eq("type", "essay")
    .eq("category", category)
    .eq("slug", slug)
    .eq("draft", false)
    .maybeSingle();
  if (error) throw error;
  return data ? mapPost(data as PostRow) : null;
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
