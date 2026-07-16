import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { ROW_COLUMNS, isValidCategorySlug } from "@/lib/blog";

interface PublishImage {
  name: string;
  /** Base64-encoded file body (no data: prefix). */
  data: string;
}

interface PublishBody {
  type: "essay" | "note";
  category?: string;
  slug?: string;
  title: string;
  description?: string;
  content: string;
  tags?: string[];
  date?: string;
  draft?: boolean;
  images?: PublishImage[];
  cover?: string;
}

const MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  svg: "image/svg+xml",
};

function unauthorized(): NextResponse {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

function checkAuth(req: NextRequest): boolean {
  const token = process.env.BLOG_API_TOKEN;
  if (!token) return false;
  return req.headers.get("authorization") === `Bearer ${token}`;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function revalidateBlog(category: string | null, slug: string): void {
  revalidatePath("/blog");
  revalidatePath("/articles");
  revalidatePath("/notes");
  if (category) {
    revalidatePath(`/blog/${category}`);
    revalidatePath(`/blog/${category}/${slug}`);
  }
}

async function uploadImages(
  slug: string,
  images: PublishImage[]
): Promise<Record<string, string>> {
  const supabase = supabaseAdmin();
  const urls: Record<string, string> = {};
  for (const image of images) {
    const ext = image.name.split(".").pop()?.toLowerCase() ?? "";
    const mime = MIME[ext];
    if (!mime) throw new Error(`unsupported image type: ${image.name}`);
    const storagePath = `posts/${slug}/${image.name}`;
    const { error } = await supabase.storage
      .from("blog-images")
      .upload(storagePath, Buffer.from(image.data, "base64"), {
        contentType: mime,
        upsert: true,
      });
    if (error) throw new Error(`image upload failed: ${error.message}`);
    const { data } = supabase.storage
      .from("blog-images")
      .getPublicUrl(storagePath);
    urls[image.name] = data.publicUrl;
  }
  return urls;
}

/** Replace ./name or name image refs in markdown with uploaded URLs. */
function resolveImageRefs(md: string, urls: Record<string, string>): string {
  let out = md;
  for (const [name, url] of Object.entries(urls)) {
    out = out.replaceAll(`](./${name})`, `](${url})`).replaceAll(`](${name})`, `](${url})`);
  }
  return out;
}

function validate(body: PublishBody): string | null {
  if (!body.title?.trim()) return "title is required";
  if (!body.content?.trim()) return "content is required";
  if (body.type !== "essay" && body.type !== "note") return "type must be essay or note";
  if (body.type === "essay") {
    if (!body.category) return "category is required for essays";
    if (!isValidCategorySlug(body.category)) {
      return "category must be lowercase letters, numbers, and hyphens only";
    }
  }
  return null;
}

const ADMIN_ROW_COLUMNS = `${ROW_COLUMNS}, created_at, updated_at`;
const LIST_COLUMNS =
  "type, category, slug, title, description, tags, date, draft, updated_at";

/**
 * Read posts back (authenticated) — including drafts, which the public site
 * and RLS hide. Uses the admin client to bypass RLS.
 *
 *   GET ?type=essay&slug=my-post   -> single post (full row incl. content_md)
 *   GET ?draft=true                -> list drafts only (metadata, newest first)
 *   GET ?type=note                 -> list all notes (metadata)
 *   GET                            -> list all posts (metadata)
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!checkAuth(req)) return unauthorized();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const slug = searchParams.get("slug");
  const draftsOnly = searchParams.get("draft") === "true";

  try {
    // Single post by type+slug
    if (type && slug) {
      const { data, error } = await supabaseAdmin()
        .from("posts")
        .select(ADMIN_ROW_COLUMNS)
        .eq("type", type)
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) return NextResponse.json({ error: "post not found" }, { status: 404 });
      return NextResponse.json({ ok: true, post: data });
    }

    // Listing (metadata only)
    let query = supabaseAdmin()
      .from("posts")
      .select(LIST_COLUMNS)
      .order("date", { ascending: false });
    if (type) query = query.eq("type", type);
    if (draftsOnly) query = query.eq("draft", true);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true, count: data?.length ?? 0, posts: data ?? [] });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "read failed" },
      { status: 500 }
    );
  }
}

/** Create (or upsert) a post. */
export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!checkAuth(req)) return unauthorized();

  let body: PublishBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const invalid = validate(body);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  const slug = body.slug?.trim() || slugify(body.title);
  const category = body.type === "essay" ? body.category! : null;

  try {
    let content = body.content;
    let coverUrl: string | null = null;
    if (body.images?.length) {
      const urls = await uploadImages(slug, body.images);
      content = resolveImageRefs(content, urls);
      if (body.cover && urls[body.cover]) coverUrl = urls[body.cover];
    }

    const { error } = await supabaseAdmin()
      .from("posts")
      .upsert(
        {
          type: body.type,
          category,
          slug,
          title: body.title.trim(),
          description: body.description?.trim() ?? "",
          content_md: content.trim(),
          tags: body.tags ?? [],
          date: body.date ?? new Date().toISOString().slice(0, 10),
          draft: body.draft ?? true,
          ...(coverUrl ? { cover_url: coverUrl } : {}),
        },
        { onConflict: "type,slug" }
      );
    if (error) throw new Error(error.message);

    revalidateBlog(category, slug);
    const url = category ? `/blog/${category}/${slug}` : "/notes";
    return NextResponse.json({ ok: true, slug, url, draft: body.draft ?? true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "publish failed" },
      { status: 500 }
    );
  }
}

/** Partial update by type+slug (e.g. flip draft to publish). */
export async function PUT(req: NextRequest): Promise<NextResponse> {
  if (!checkAuth(req)) return unauthorized();

  let body: Partial<PublishBody> & { type: string; slug: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  if (!body.type || !body.slug) {
    return NextResponse.json({ error: "type and slug are required" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (body.title !== undefined) updates.title = body.title;
  if (body.description !== undefined) updates.description = body.description;
  if (body.content !== undefined) updates.content_md = body.content;
  if (body.tags !== undefined) updates.tags = body.tags;
  if (body.date !== undefined) updates.date = body.date;
  if (body.draft !== undefined) updates.draft = body.draft;
  if (body.category !== undefined) updates.category = body.category;
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "no fields to update" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin()
    .from("posts")
    .update(updates)
    .eq("type", body.type)
    .eq("slug", body.slug)
    .select("category, slug")
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "post not found" }, { status: 404 });

  revalidateBlog(data.category, data.slug);
  return NextResponse.json({ ok: true });
}

/** Delete a post by type+slug. */
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  if (!checkAuth(req)) return unauthorized();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const slug = searchParams.get("slug");
  if (!type || !slug) {
    return NextResponse.json({ error: "type and slug query params required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin()
    .from("posts")
    .delete()
    .eq("type", type)
    .eq("slug", slug)
    .select("category, slug")
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "post not found" }, { status: 404 });

  revalidateBlog(data.category, data.slug);
  return NextResponse.json({ ok: true, deleted: `${type}/${slug}` });
}
