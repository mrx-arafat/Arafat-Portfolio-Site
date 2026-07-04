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
2. Human reviews at `/blog/<category>/<slug>` (drafts 404 publicly — check the DB row or flip briefly; draft-preview URL is a future improvement)
3. `PUT {draft: false}` → live instantly

## Where things live

- Route handler: `app/api/blog/publish/route.ts`
- DB: Supabase `posts` table (`supabase/migrations/001_posts.sql`)
- Images: Supabase Storage bucket `blog-images` (public read)
- Generated covers: `app/api/og/route.tsx` (`?size=card` for portrait thumbnails)
