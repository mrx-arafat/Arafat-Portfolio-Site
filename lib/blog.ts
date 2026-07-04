import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/** Default content root — override in tests. */
export const CONTENT_ROOT = path.join(process.cwd(), "content");

export interface PostMeta {
  slug: string;
  category: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readTime: string;
  draft: boolean;
  /** Absolute path to the post folder (for image resolution). */
  dir: string;
  cover: string | null;
}

export interface Post extends PostMeta {
  content: string;
}

export interface NoteMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  readTime: string;
  draft: boolean;
}

export interface Note extends NoteMeta {
  content: string;
}

export interface Category {
  name: string;
  count: number;
}

const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}-/;

/** Compute "N min read" from raw text at 200 wpm, floor 1. */
export function computeReadTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "");
}

function findCover(dir: string): string | null {
  for (const ext of ["png", "jpg", "jpeg", "webp", "avif"]) {
    const p = path.join(dir, `cover.${ext}`);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function readPostFile(dir: string, category: string): Post | null {
  const file = path.join(dir, "index.mdx");
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return {
    slug: path.basename(dir).replace(DATE_PREFIX, ""),
    category,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    date: toDateString(data.date),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readTime: computeReadTime(content),
    draft: data.draft === true,
    dir,
    cover: findCover(dir),
    content,
  };
}

function listDirs(parent: string): string[] {
  if (!fs.existsSync(parent)) return [];
  return fs
    .readdirSync(parent, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
}

/** All essays, newest first. Drafts excluded unless includeDrafts. */
export function getAllPosts(
  root: string = CONTENT_ROOT,
  opts: { includeDrafts?: boolean } = {}
): Post[] {
  const blogRoot = path.join(root, "blog");
  const posts: Post[] = [];
  for (const category of listDirs(blogRoot)) {
    for (const folder of listDirs(path.join(blogRoot, category))) {
      const post = readPostFile(path.join(blogRoot, category, folder), category);
      if (post && (opts.includeDrafts || !post.draft)) posts.push(post);
    }
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

/** Single published-or-draft post by category + slug, null if missing. */
export function getPost(
  category: string,
  slug: string,
  root: string = CONTENT_ROOT
): Post | null {
  const categoryDir = path.join(root, "blog", category);
  for (const folder of listDirs(categoryDir)) {
    if (folder.replace(DATE_PREFIX, "") === slug) {
      return readPostFile(path.join(categoryDir, folder), category);
    }
  }
  return null;
}

/** All notes (content/notes/YYYY/MM/*.mdx), newest first. */
export function getAllNotes(
  root: string = CONTENT_ROOT,
  opts: { includeDrafts?: boolean } = {}
): Note[] {
  const notesRoot = path.join(root, "notes");
  const notes: Note[] = [];
  for (const year of listDirs(notesRoot)) {
    for (const month of listDirs(path.join(notesRoot, year))) {
      const monthDir = path.join(notesRoot, year, month);
      for (const file of fs.readdirSync(monthDir)) {
        if (!file.endsWith(".mdx")) continue;
        const raw = fs.readFileSync(path.join(monthDir, file), "utf8");
        const { data, content } = matter(raw);
        const note: Note = {
          slug: file.replace(/\.mdx$/, "").replace(DATE_PREFIX, ""),
          title: String(data.title ?? ""),
          date: toDateString(data.date),
          tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
          readTime: computeReadTime(content),
          draft: data.draft === true,
          content,
        };
        if (opts.includeDrafts || !note.draft) notes.push(note);
      }
    }
  }
  return notes.sort((a, b) => b.date.localeCompare(a.date));
}

/** Categories that have at least one published post, with counts. */
export function getCategories(root: string = CONTENT_ROOT): Category[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts(root)) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
}

/** Published posts carrying the given tag. */
export function getPostsByTag(tag: string, root: string = CONTENT_ROOT): Post[] {
  return getAllPosts(root).filter((p) => p.tags.includes(tag));
}

/** All unique tags across published posts. */
export function getAllTags(root: string = CONTENT_ROOT): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts(root)) post.tags.forEach((t) => tags.add(t));
  return Array.from(tags).sort();
}
