# Blog Publish API

Programmatic publishing for arafatops.com. One endpoint, token-auth, writes to Supabase, pages revalidate instantly — no rebuild, no git commit.

```
POST   /api/blog/publish          create or upsert a post
PUT    /api/blog/publish          partial update (e.g. flip draft)
DELETE /api/blog/publish?type=&slug=   delete a post
```

Base URL: `https://www.arafatops.com` (or `http://localhost:3010` in dev).

## Authentication

Every request requires:

```
Authorization: Bearer <BLOG_API_TOKEN>
```

Token lives in `.env.local` (local) and Vercel env vars (production). Missing/wrong token → `401 {"error":"unauthorized"}`.

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
| 404 | PUT/DELETE target not found |
| 500 | Supabase/storage failure — body carries `{"error": "..."}` |

## Recommended AI workflow

1. `POST` with `draft: true`
2. Verify what was stored: `GET /api/blog/publish?type=essay&slug=<slug>` (returns the full row incl. `content_md`), or list all drafts with `GET /api/blog/publish?draft=true`
3. Human previews the rendered draft via a preview link (see below) — no need to publish first
4. `PUT {draft: false}` → live instantly

## Reading posts back (`GET`)

Authenticated (same bearer token), reads through the admin client so **drafts are included**.

| Request | Returns |
|---------|---------|
| `GET /api/blog/publish?type=essay&slug=<slug>` | single post, full row (incl. `content_md`) |
| `GET /api/blog/publish?draft=true` | all drafts (metadata, newest first) |
| `GET /api/blog/publish?type=note` | all notes (metadata) |
| `GET /api/blog/publish` | all posts (metadata) |

## Draft preview

Drafts 404 on the public site (hidden by RLS). To view a draft rendered, open a preview link — it sets a Draft Mode cookie and shows the unpublished post with a "DRAFT PREVIEW" banner:

```
/api/blog/preview?token=<BLOG_API_TOKEN>&type=essay&category=<cat>&slug=<slug>
```

Exit preview any time via `/api/blog/preview?exit=1` (or the banner's "exit preview" link). The token appears in the preview URL — treat these links as secret.

## Where things live

- Route handlers: `app/api/blog/publish/route.ts` (POST/PUT/DELETE/GET), `app/api/blog/preview/route.ts` (Draft Mode enable/exit)
- Draft-aware read: `getPost` in `lib/blog.ts` (uses the admin client + drops the `draft=false` filter when Draft Mode is on)
- DB: Supabase `posts` table (`supabase/migrations/001_posts.sql`)
- Images: Supabase Storage bucket `blog-images` (public read)
- Generated covers: `app/api/og/route.tsx` (`?size=card` for portrait thumbnails)
