import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  computeReadTime,
  mapPost,
  mapNote,
  getAllPosts,
  getAdjacentPosts,
  getPost,
  getAllNotes,
  getCategories,
  getPostsByTag,
  getAllTags,
  previewTargetKey,
  PREVIEW_COOKIE,
  type PostRow,
} from "@/lib/blog";
import { supabasePublic, supabaseAdmin } from "@/lib/supabase";
import { cookies, draftMode } from "next/headers";

vi.mock("@/lib/supabase", () => ({
  supabasePublic: vi.fn(),
  supabaseAdmin: vi.fn(),
}));

vi.mock("next/headers", () => ({
  draftMode: vi.fn(async () => ({ isEnabled: false })),
  cookies: vi.fn(async () => ({ get: () => undefined })),
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
  vi.mocked(supabaseAdmin).mockReset();
  vi.mocked(draftMode).mockReset();
  vi.mocked(draftMode).mockResolvedValue({ isEnabled: false } as never);
  vi.mocked(cookies).mockReset();
  vi.mocked(cookies).mockResolvedValue({ get: () => undefined } as never);
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

  it("filters to published (draft=false) using the public client when not previewing", async () => {
    const { from, builder } = mockQuery(essayRow());
    vi.mocked(supabasePublic).mockReturnValue({ from } as never);

    await getPost("security", "axios-attack");

    expect(supabasePublic).toHaveBeenCalled();
    expect(supabaseAdmin).not.toHaveBeenCalled();
    expect(vi.mocked(builder.eq as never)).toHaveBeenCalledWith("draft", false);
  });

  it("in draft-preview mode for the authorized post, uses the admin client and returns a draft without the draft filter", async () => {
    vi.mocked(draftMode).mockResolvedValue({ isEnabled: true } as never);
    vi.mocked(cookies).mockResolvedValue({
      get: (name: string) =>
        name === PREVIEW_COOKIE
          ? { value: previewTargetKey("essay", "security", "axios-attack") }
          : undefined,
    } as never);
    const { from, builder } = mockQuery(essayRow({ draft: true }));
    vi.mocked(supabaseAdmin).mockReturnValue({ from } as never);

    const post = await getPost("security", "axios-attack");

    expect(post?.draft).toBe(true);
    expect(supabaseAdmin).toHaveBeenCalled();
    expect(supabasePublic).not.toHaveBeenCalled();
    expect(vi.mocked(builder.eq as never)).not.toHaveBeenCalledWith("draft", false);
  });

  it("does not bypass the draft filter for a different post than the preview cookie authorizes", async () => {
    vi.mocked(draftMode).mockResolvedValue({ isEnabled: true } as never);
    vi.mocked(cookies).mockResolvedValue({
      get: (name: string) =>
        name === PREVIEW_COOKIE
          ? { value: previewTargetKey("essay", "security", "draft-a") }
          : undefined,
    } as never);
    const { from, builder } = mockQuery(essayRow({ slug: "draft-b", draft: true }));
    vi.mocked(supabasePublic).mockReturnValue({ from } as never);

    await getPost("security", "draft-b");

    expect(supabasePublic).toHaveBeenCalled();
    expect(supabaseAdmin).not.toHaveBeenCalled();
    expect(vi.mocked(builder.eq as never)).toHaveBeenCalledWith("draft", false);
  });
});

describe("getAdjacentPosts", () => {
  const posts = [
    mapPost(essayRow({ slug: "c", date: "2026-07-03" })),
    mapPost(essayRow({ slug: "b", date: "2026-07-02" })),
    mapPost(essayRow({ slug: "a", date: "2026-07-01" })),
  ];

  it("returns older/newer around a middle post", () => {
    const { older, newer } = getAdjacentPosts(posts, "security", "b");
    expect(older?.slug).toBe("a");
    expect(newer?.slug).toBe("c");
  });

  it("has no newer for the first (newest) post", () => {
    const { older, newer } = getAdjacentPosts(posts, "security", "c");
    expect(newer).toBeNull();
    expect(older?.slug).toBe("b");
  });

  it("has no older for the last (oldest) post", () => {
    const { older, newer } = getAdjacentPosts(posts, "security", "a");
    expect(older).toBeNull();
    expect(newer?.slug).toBe("b");
  });

  it("returns both null when the post isn't in the published list (e.g. an unpublished draft preview)", () => {
    const { older, newer } = getAdjacentPosts(posts, "security", "draft-not-published");
    expect(older).toBeNull();
    expect(newer).toBeNull();
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
