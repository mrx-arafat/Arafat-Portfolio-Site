import { NextRequest, NextResponse } from "next/server";
import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { PREVIEW_COOKIE, previewTargetKey, isValidCategorySlug } from "@/lib/blog";

/**
 * Enable/disable Next.js Draft Mode so authors can view unpublished posts.
 *
 * Enable:  GET /api/blog/preview?token=<BLOG_API_TOKEN>&type=essay&category=psychology&slug=my-post
 *          -> sets the draft cookie, redirects to the (draft) post page.
 * Exit:    GET /api/blog/preview?token=<BLOG_API_TOKEN>&exit=1
 *          -> clears the draft cookie, redirects home.
 *
 * The token appears in this URL, so treat preview links as secret and don't
 * share them. The render path itself is cookie-gated (Draft Mode + a
 * PREVIEW_COOKIE naming this exact post), not token-in-URL — and scoped to
 * this one post, so it can't be used to browse every other draft on the site.
 */
export async function GET(req: NextRequest): Promise<NextResponse | never> {
  const token = process.env.BLOG_API_TOKEN;
  const { searchParams } = new URL(req.url);
  const draft = await draftMode();

  // Exiting preview only clears the caller's own cookie — no token needed.
  if (searchParams.get("exit")) {
    draft.disable();
    (await cookies()).delete(PREVIEW_COOKIE);
    redirect("/");
  }

  if (!token || searchParams.get("token") !== token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const type = searchParams.get("type") ?? "essay";
  const slug = searchParams.get("slug");
  const category = searchParams.get("category");

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }
  if (type === "essay" && (!category || !isValidCategorySlug(category))) {
    return NextResponse.json(
      { error: "category is required for essays and must be lowercase letters, numbers, and hyphens only" },
      { status: 400 }
    );
  }

  draft.enable();
  (await cookies()).set(
    PREVIEW_COOKIE,
    previewTargetKey(type as "essay" | "note", type === "essay" ? category : null, slug),
    { httpOnly: true, secure: true, sameSite: "lax", path: "/" }
  );
  redirect(type === "essay" ? `/blog/${category}/${slug}` : "/notes");
}
