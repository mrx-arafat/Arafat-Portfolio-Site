# Blog Publish API

Programmatic publishing for arafatops.com. One endpoint family, token-auth, writes to Supabase, pages revalidate instantly — no rebuild, no git commit.

```
POST   /api/blog/publish          create or upsert a post
GET    /api/blog/publish          read back a post, or list posts/drafts
PUT    /api/blog/publish          partial update (e.g. flip draft -> live)
DELETE /api/blog/publish?type=&slug=   delete a post

GET    /api/blog/preview          enable Draft Mode, view a draft rendered
GET    /api/blog/preview?exit=1   exit Draft Mode
```

Base URL: `https://www.arafatops.com` (or `http://localhost:3010` in dev).

## Authentication

Every `/api/blog/publish` request requires:

```
Authorization: Bearer <BLOG_API_TOKEN>
```

Token lives in `.env.local` (local) and Vercel env vars (production). Missing/wrong token → `401 {"error":"unauthorized"}`.

`/api/blog/preview` uses the same token, but as a `?token=` query param (see [Draft preview](#draft-preview)).

## The full workflow

1. **`POST`** with `"draft": true` → post exists in the DB, invisible on the public site.
2. **`GET ?type=&slug=`** → confirm exactly what got stored (title, content, tags, etc.).
3. **Open a preview link** → see it fully rendered, in your browser, with a "DRAFT PREVIEW" banner. Nobody else can see it.
4. **`PUT {"draft": false}`** → live instantly, no rebuild, no further action needed.

Steps 2 and 3 are both optional — you can `POST` straight with `"draft": false` to publish immediately, or `PUT` to flip a draft live without ever previewing it. But for anything you want to sanity-check first, this is the safe path.

## POST — create / upsert

Upserts on `(type, slug)` — same slug twice = overwrite, safe to re-run.

### Body

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `type` | `"essay"` \| `"note"` | yes | notes have no category, render on `/notes` |
| `category` | string | essays only | one of: `security`, `engineering`, `business`, `psychology`, `life` |
| `title` | string | yes | slug auto-generated from it |
| `content` | string | yes | full markdown (GFM + code blocks, syntax highlighted) |
| `slug` | string | no | override auto slug |
| `description` | string | no | meta description, ~155 chars — always set for essays (SEO) |
| `tags` | string[] | no | freeform, lowercase kebab preferred |
| `date` | `YYYY-MM-DD` | no | defaults to today |
| `draft` | boolean | no | **defaults `true`** — post hidden until flipped |
| `images` | `[{name, data}]` | no | `data` = base64 (no `data:` prefix); uploaded to Supabase Storage at `posts/<slug>/<name>` |
| `cover` | string | no | filename from `images` to use as card/social cover |

Markdown image refs `![x](./diagram.png)` or `![x](diagram.png)` are rewritten to the uploaded Storage URLs automatically. No cover → auto-generated terminal-style cover.

### Example

```bash
curl -X POST https://www.arafatops.com/api/blog/publish \
  -H "Authorization: Bearer $BLOG_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "essay",
    "category": "security",
    "title": "Hunting IDORs in WordPress Plugins",
    "description": "A practical methodology for finding IDOR vulnerabilities in WordPress plugin REST endpoints.",
    "content": "## Intro\n\nFull markdown here...\n\n![flow](./flow.png)",
    "tags": ["idor", "wordpress", "bug-bounty"],
    "draft": true,
    "images": [{"name": "flow.png", "data": "iVBORw0KGgo..."}],
    "cover": "flow.png"
  }'
```

### Response

```json
{ "ok": true, "slug": "hunting-idors-in-wordpress-plugins",
  "url": "/blog/security/hunting-idors-in-wordpress-plugins", "draft": true }
```

Notes return `"url": "/notes"`.

## GET — read a post back, or list posts/drafts

Authenticated (same bearer token). Reads through the admin client, so **drafts are included** — this is the only way to fetch a draft's data without publishing or previewing it.

| Request | Returns |
|---------|---------|
| `GET /api/blog/publish?type=essay&slug=<slug>` | single post, full row (incl. `content_md`) |
| `GET /api/blog/publish?draft=true` | all drafts (metadata, newest first) |
| `GET /api/blog/publish?type=note` | all notes (metadata) |
| `GET /api/blog/publish` | all posts (metadata) |

```bash
# confirm exactly what a POST stored
curl "https://www.arafatops.com/api/blog/publish?type=essay&slug=hunting-idors-in-wordpress-plugins" \
  -H "Authorization: Bearer $BLOG_API_TOKEN"

# forgot which drafts are pending?
curl "https://www.arafatops.com/api/blog/publish?draft=true" \
  -H "Authorization: Bearer $BLOG_API_TOKEN"
```

Single-post response: `{"ok": true, "post": {...}}` · unknown slug → `404`.
List response: `{"ok": true, "count": N, "posts": [...]}`.

## PUT — update / publish a draft

Identify by `type` + `slug`; send only fields to change (`title`, `description`, `content`, `tags`, `date`, `draft`, `category`).

```bash
# review done -> go live
curl -X PUT https://www.arafatops.com/api/blog/publish \
  -H "Authorization: Bearer $BLOG_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "essay", "slug": "hunting-idors-in-wordpress-plugins", "draft": false}'
```

Response: `{"ok": true}` · unknown slug → `404`.

## DELETE

```bash
curl -X DELETE "https://www.arafatops.com/api/blog/publish?type=essay&slug=some-post" \
  -H "Authorization: Bearer $BLOG_API_TOKEN"
```

Response: `{"ok": true, "deleted": "essay/some-post"}`.

## Errors

| Status | Meaning |
|--------|---------|
| 400 | invalid JSON, missing title/content, bad type/category, no fields to update |
| 401 | missing/invalid bearer token |
| 404 | GET/PUT/DELETE target not found |
| 500 | Supabase/storage failure — body carries `{"error": "..."}` |

## Draft preview

Drafts 404 on the public site (hidden by Supabase RLS). To see one rendered exactly as it will look live, open a preview link:

```
/api/blog/preview?token=<BLOG_API_TOKEN>&type=essay&category=<category>&slug=<slug>
```

- Enables Next.js Draft Mode and sets a `PREVIEW_COOKIE` naming **that exact post** (`type:category:slug`).
- Redirects to the normal post URL — same page component, same rendering — with a "● DRAFT PREVIEW" banner and an "exit preview" link.
- **Scoped, not global**: the cookie only authorizes the one post it was issued for. Visiting a *different* draft's URL with that cookie still set falls back to the public, published-only read (404s normally) — one preview link can't be used to browse every other unpublished draft on the site.

Exit any time via:

```
/api/blog/preview?token=<BLOG_API_TOKEN>&exit=1
```

(or the banner's "exit preview" link — no token needed to exit, only to enter).

The token appears in the preview URL, so treat preview links as secret — don't paste them somewhere public.

## Troubleshooting: "I published but the page 404s"

- **Right after `POST`/`PUT`**: `revalidatePath` fires immediately, but Vercel's edge cache can take a few seconds to catch up in some regions. Hard-refresh or wait ~30s before concluding it's broken.
- **Confirm the row itself is correct** — don't guess from the browser: `GET /api/blog/publish?type=essay&slug=<slug>` and check `draft` is `false` and `category`/`slug` match the URL you're hitting exactly.
- **Check you're hitting a slug that actually exists** — a title like "You Don't Have Three Problems, You Have One" doesn't necessarily slugify to the string you'd guess; always confirm via the GET above or the response from `POST`/`PUT`, not by eyeballing the title.
- **Still stuck?** Open the URL in headed Playwright (or just a real browser, incognito, different network) — curl succeeding but the browser failing points to something local (DNS cache, extension, proxy), not the API.

## Recommended AI workflow

1. `POST` with `draft: true`.
2. `GET ?type=&slug=` to confirm exactly what was stored.
3. Preview via the link above so the human can see the real rendered page before it's public.
4. `PUT {draft: false}` once approved.

## Where things live

- Route handlers: `app/api/blog/publish/route.ts` (POST/PUT/DELETE/GET), `app/api/blog/preview/route.ts` (Draft Mode enable/exit)
- Draft-aware read: `getPost` in `lib/blog.ts` — uses the admin client and drops the `draft=false` filter only when the preview cookie authorizes that exact post
- Adjacent-post nav: `getAdjacentPosts` in `lib/blog.ts` — returns no older/newer links when previewing a post that isn't in the published list
- DB: Supabase `posts` table (`supabase/migrations/001_posts.sql`)
- Images: Supabase Storage bucket `blog-images` (public read)
- Generated covers: `app/api/og/route.tsx` (`?size=card` for portrait thumbnails)
