import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  computeReadTime,
  mapPost,
  mapNote,
  getAllPosts,
  getPost,
  getAllNotes,
  getCategories,
  getPostsByTag,
  getAllTags,
  type PostRow,
} from "@/lib/blog";
import { supabasePublic } from "@/lib/supabase";

vi.mock("@/lib/supabase", () => ({
  supabasePublic: vi.fn(),
}));

function essayRow(overrides: Partial<PostRow> = {}): PostRow {
  return {
    type: "essay",
    category: "security",
    slug: "axios-attack",
    title: "Axios Supply Chain Attack",
    description: "npm compromise breakdown",
    content_md: "# Intro\n\nSome analysis content here.",
    tags: ["npm", "supply-chain"],
    date: "2026-07-01",
    draft: false,
    cover_url: null,
    ...overrides,
  };
}

/** Chainable query builder mock resolving to the given rows. */
function mockQuery(rows: PostRow[] | PostRow | null) {
  const result = { data: rows, error: null };
  const builder: Record<string, unknown> = {};
  for (const m of ["select", "eq", "contains", "order"]) {
    builder[m] = vi.fn().mockReturnValue(builder);
  }
  builder.maybeSingle = vi.fn().mockResolvedValue(result);
  // Awaiting the builder itself resolves list queries
  builder.then = (resolve: (v: unknown) => unknown) =>
    Promise.resolve(result).then(resolve);
  return { from: vi.fn().mockReturnValue(builder), builder };
}

beforeEach(() => {
  vi.mocked(supabasePublic).mockReset();
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

describe("mapPost", () => {
  it("maps a row to a Post with computed read time", () => {
    const post = mapPost(essayRow());
    expect(post).toMatchObject({
      slug: "axios-attack",
      category: "security",
      title: "Axios Supply Chain Attack",
      date: "2026-07-01",
      tags: ["npm", "supply-chain"],
      cover: null,
      draft: false,
    });
    expect(post.readTime).toMatch(/min read$/);
    expect(post.content).toContain("analysis content");
  });

  it("defaults null category and tags", () => {
    const post = mapPost(essayRow({ category: null, tags: undefined as unknown as string[] }));
    expect(post.category).toBe("");
    expect(post.tags).toEqual([]);
  });
});

describe("mapNote", () => {
  it("maps a note row without category", () => {
    const note = mapNote(essayRow({ type: "note", category: null, slug: "day-one" }));
    expect(note.slug).toBe("day-one");
    expect(note).not.toHaveProperty("category");
  });
});

describe("getAllPosts", () => {
  it("returns mapped essays from supabase", async () => {
    const { from } = mockQuery([essayRow(), essayRow({ slug: "second", date: "2026-06-01" })]);
    vi.mocked(supabasePublic).mockReturnValue({ from } as never);

    const posts = await getAllPosts();
    expect(posts).toHaveLength(2);
    expect(posts[0].slug).toBe("axios-attack");
    expect(from).toHaveBeenCalledWith("posts");
  });
});

describe("getPost", () => {
  it("returns single post via maybeSingle", async () => {
    const { from } = mockQuery(essayRow());
    vi.mocked(supabasePublic).mockReturnValue({ from } as never);

    const post = await getPost("security", "axios-attack");
    expect(post?.title).toBe("Axios Supply Chain Attack");
  });

  it("returns null when not found", async () => {
    const { from } = mockQuery(null);
    vi.mocked(supabasePublic).mockReturnValue({ from } as never);

    expect(await getPost("security", "nope")).toBeNull();
  });
});

describe("getAllNotes", () => {
  it("returns mapped notes", async () => {
    const { from } = mockQuery([essayRow({ type: "note", category: null, slug: "day-one" })]);
    vi.mocked(supabasePublic).mockReturnValue({ from } as never);

    const notes = await getAllNotes();
    expect(notes[0].slug).toBe("day-one");
  });
});

describe("getCategories", () => {
  it("counts published posts per category", async () => {
    const { from } = mockQuery([
      essayRow(),
      essayRow({ slug: "b" }),
      essayRow({ slug: "c", category: "life" }),
    ]);
    vi.mocked(supabasePublic).mockReturnValue({ from } as never);

    const cats = await getCategories();
    expect(cats).toEqual(
      expect.arrayContaining([
        { name: "security", count: 2 },
        { name: "life", count: 1 },
      ])
    );
  });
});

describe("getPostsByTag", () => {
  it("passes tag as array to contains filter", async () => {
    const { from, builder } = mockQuery([essayRow()]);
    vi.mocked(supabasePublic).mockReturnValue({ from } as never);

    await getPostsByTag("npm");
    expect(builder.contains).toHaveBeenCalledWith("tags", ["npm"]);
  });
});

describe("getAllTags", () => {
  it("returns sorted unique tags", async () => {
    const { from } = mockQuery([
      essayRow(),
      essayRow({ slug: "b", tags: ["web", "npm"] }),
    ]);
    vi.mocked(supabasePublic).mockReturnValue({ from } as never);

    expect(await getAllTags()).toEqual(["npm", "supply-chain", "web"]);
  });
});
