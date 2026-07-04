# Native Blog — Design

**Date:** 2026-07-05
**Status:** Approved
**Goal:** Replace Medium as primary writing home. Daily notes + long-form essays, native on arafatops.com, full SEO ownership, AI-publishable via API.

## Decisions

| Question | Decision |
|----------|----------|
| Authoring | MDX files in repo (git-versioned, SSG, zero cost) |
| Old Medium articles | Stay on Medium as links — "On Medium" archive section. No republishing (duplicate-content risk; Medium owns canonical) |
| Taxonomy | 5 fixed categories (folder = category) + freeform tags in frontmatter |
| Post types | **Essays** (long-form, polished) + **Notes** (short daily, journal-style) — separate feeds |
| AI publishing | REST API that commits MDX to GitHub → auto-deploy. No database |

## Content model

Post = folder. Everything colocated:

```
content/
  blog/
    security/
      2026-07-05-axios-supply-chain/
        index.mdx          # the post
        cover.png          # auto-detected cover + OG image
        attack-flow.png    # inline images, relative refs
    engineering/
    business/
    psychology/
    life/
  notes/
    2026/
      07/
        2026-07-05-on-discipline.mdx   # single-file, year/month folders
```

- **Category = folder path.** Single source of truth, no frontmatter duplication.
- Inline images: `![alt](./attack-flow.png)` — build resolves relative paths through `next/image` (WebP, lazy, sized).
- No `cover.png` → OG image auto-generated from title via `@vercel/og`.

### Frontmatter

```yaml
---
title: "Anatomy of the Axios Supply Chain Attack"
description: "How a 3-hour npm compromise..."   # meta description ~155 chars
date: 2026-07-05
tags: [npm, supply-chain, malware]
draft: true                                      # hidden until false
---
```

Notes: same minus description optional, no category.

### Pipeline

`lib/blog.ts` reads `content/` at build time: `gray-matter` frontmatter parse, read-time computed, date-sorted. MDX rendered via `next-mdx-remote/rsc` (or `@next/mdx`). All SSG — every post pre-rendered.

Rehype/remark: `rehype-slug`, `rehype-autolink-headings`, `shiki` code highlighting (green-on-black terminal theme).

## Publish API

```
POST /api/blog/publish        Authorization: Bearer <BLOG_API_TOKEN>
{
  "type": "essay" | "note",
  "category": "security",
  "title": "...",
  "content": "full markdown...",
  "tags": ["npm"],
  "images": [{ "name": "cover.png", "data": "<base64>" }],
  "draft": true
}
```

- Handler commits post folder to GitHub via Contents API → Vercel auto-deploys → live ~2 min.
- AI posts = reviewable git commits. Same history as hand-written.
- `GET /api/blog/posts` — list (AI checks what exists).
- `PUT /api/blog/publish` — update / flip draft after review.
- Auth: single secret token in env. Slug generated from title + date.

## Routes

```
/blog                          index — essays + notes stream + "On Medium" archive
/blog/[category]               5 category landing pages
/blog/[category]/[slug]        post page
/blog/tag/[tag]                tag pages
/notes                         daily notes stream
/blog/rss.xml                  RSS feed
/articles                      301 → /blog
```

Post page: title, date, terminal-style category chip (`cd blog/security`), read time, TOC for essays, prev/next.

## SEO

- `generateMetadata` per post — title, description, canonical on own domain
- `BlogPosting` + `BreadcrumbList` JSON-LD per post
- Sitemap auto-extends with posts + category pages
- RSS feed
- OG images: cover or generated terminal card
- Old `/articles` route 301s to `/blog`; Medium links kept as external archive

## Theme

Match dashboard hacker terminal: `#0a0a0a`/`#0f0f0f` backgrounds, `#2ed573` green scale text, mono accents, corner brackets, terminal chips. Code blocks styled as terminal windows.

## Implementation phases

1. **Content lib + MDX pipeline** — `lib/blog.ts`, MDX render, seed post, image resolution
2. **Pages** — blog index, category, post, notes, tag
3. **SEO** — metadata, JSON-LD, sitemap, RSS, OG generation, /articles redirect
4. **Publish API** — GitHub Contents commit, token auth, list/update endpoints

## Out of scope (YAGNI, later if wanted)

- Full-text search
- Comments
- Newsletter
- View counters / analytics dashboard
- Multi-author
