import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  getAllPosts,
  getPost,
  getAllNotes,
  getCategories,
  getPostsByTag,
  computeReadTime,
} from "@/lib/blog";

let root: string;

function writePost(
  category: string,
  folder: string,
  frontmatter: string,
  body: string
) {
  const dir = path.join(root, "blog", category, folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.mdx"), `---\n${frontmatter}\n---\n\n${body}\n`);
  return dir;
}

function writeNote(year: string, month: string, file: string, frontmatter: string, body: string) {
  const dir = path.join(root, "notes", year, month);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, file), `---\n${frontmatter}\n---\n\n${body}\n`);
}

beforeAll(() => {
  root = mkdtempSync(path.join(tmpdir(), "blog-test-"));

  writePost(
    "security",
    "2026-07-01-axios-attack",
    `title: "Axios Supply Chain Attack"\ndescription: "npm compromise breakdown"\ndate: 2026-07-01\ntags: [npm, supply-chain]`,
    "# Intro\n\nSome analysis content here."
  );
  writePost(
    "security",
    "2026-07-03-idor-hunting",
    `title: "IDOR Hunting"\ndescription: "finding IDORs"\ndate: 2026-07-03\ntags: [idor, web]`,
    "IDOR content."
  );
  writePost(
    "life",
    "2026-06-20-discipline",
    `title: "On Discipline"\ndescription: "daily systems"\ndate: 2026-06-20\ntags: [habits]`,
    "Discipline content."
  );
  writePost(
    "engineering",
    "2026-07-04-draft-post",
    `title: "Unfinished"\ndescription: "wip"\ndate: 2026-07-04\ntags: [wip]\ndraft: true`,
    "Draft content."
  );

  writeNote("2026", "07", "2026-07-05-on-focus.mdx", `title: "On Focus"\ndate: 2026-07-05\ntags: [focus]`, "Short note.");
  writeNote("2026", "06", "2026-06-30-june-wrap.mdx", `title: "June Wrap"\ndate: 2026-06-30`, "Month reflection.");
});

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

describe("getAllPosts", () => {
  it("returns published posts sorted by date desc", () => {
    const posts = getAllPosts(root);
    expect(posts.map((p) => p.slug)).toEqual([
      "idor-hunting",
      "axios-attack",
      "discipline",
    ]);
  });

  it("excludes drafts by default", () => {
    const posts = getAllPosts(root);
    expect(posts.find((p) => p.slug === "draft-post")).toBeUndefined();
  });

  it("includes drafts when requested", () => {
    const posts = getAllPosts(root, { includeDrafts: true });
    expect(posts.find((p) => p.slug === "draft-post")).toBeDefined();
  });

  it("derives category from folder path", () => {
    const posts = getAllPosts(root);
    const axios = posts.find((p) => p.slug === "axios-attack");
    expect(axios?.category).toBe("security");
  });

  it("strips date prefix from folder name for slug", () => {
    const posts = getAllPosts(root);
    expect(posts.every((p) => !/^\d{4}-\d{2}-\d{2}/.test(p.slug))).toBe(true);
  });

  it("parses frontmatter fields", () => {
    const axios = getAllPosts(root).find((p) => p.slug === "axios-attack")!;
    expect(axios.title).toBe("Axios Supply Chain Attack");
    expect(axios.description).toBe("npm compromise breakdown");
    expect(axios.tags).toEqual(["npm", "supply-chain"]);
    expect(axios.date).toBe("2026-07-01");
    expect(axios.readTime).toMatch(/min read$/);
  });
});

describe("getPost", () => {
  it("returns a single post with raw content", () => {
    const post = getPost("security", "axios-attack", root);
    expect(post?.title).toBe("Axios Supply Chain Attack");
    expect(post?.content).toContain("Some analysis content");
  });

  it("returns null for missing post", () => {
    expect(getPost("security", "nope", root)).toBeNull();
  });
});

describe("getAllNotes", () => {
  it("returns notes sorted by date desc", () => {
    const notes = getAllNotes(root);
    expect(notes.map((n) => n.slug)).toEqual(["on-focus", "june-wrap"]);
  });

  it("parses note frontmatter", () => {
    const note = getAllNotes(root)[0];
    expect(note.title).toBe("On Focus");
    expect(note.tags).toEqual(["focus"]);
  });
});

describe("getCategories", () => {
  it("returns categories with published post counts", () => {
    const cats = getCategories(root);
    expect(cats).toEqual(
      expect.arrayContaining([
        { name: "security", count: 2 },
        { name: "life", count: 1 },
      ])
    );
    // engineering only has a draft — zero published
    expect(cats.find((c) => c.name === "engineering")).toBeUndefined();
  });
});

describe("getPostsByTag", () => {
  it("filters posts by tag", () => {
    const posts = getPostsByTag("npm", root);
    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe("axios-attack");
  });
});

describe("computeReadTime", () => {
  it("computes minutes from word count at 200wpm", () => {
    const words = Array(400).fill("word").join(" ");
    expect(computeReadTime(words)).toBe("2 min read");
  });

  it("has a 1 minute floor", () => {
    expect(computeReadTime("short")).toBe("1 min read");
  });
});
