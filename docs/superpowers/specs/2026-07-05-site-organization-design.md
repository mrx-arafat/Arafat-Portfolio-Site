# Site Organization & Polish — Design

**Date:** 2026-07-05
**Status:** Approved
**Scope:** Visitor-facing structure, visual consistency, performance + SEO. Codebase-internal refactoring only where it serves these goals.

## Problem

- No global navigation — every page is an island with only a "Back to Home" link.
- Two overlapping about pages (`/about` blue Tokyo-Night theme, `/about-me` terminal-green theme) with duplicate content.
- 213+ hardcoded `#2ed573` hex values across pages; zero design tokens. The `/about` page is entirely off-theme.
- ~9 routes are full `"use client"` components with static content — unnecessary client JS, no server rendering.

## Goals

1. Clear, consistent site structure a visitor can navigate.
2. One visual identity (terminal-green) expressed through design tokens.
3. Smaller client bundles via server components.
4. Preserve the existing strong SEO layer (sitemap, RSS, JSON-LD, redirects).

## Non-Goals

- Full visual redesign — the terminal-green hacker identity stays.
- Blog/content backend changes (Supabase + MDX pipeline untouched).
- New features or pages.

## Design

### 1. IA + Navigation

- **Persistent site header nav:** `About · Featured · Projects · Security · Articles · Contact` (current page names kept).
  - `Articles` points to `/articles` (the existing unified hub of native blog + Medium posts). `/blog` and `/notes` remain and are reachable from the hub.
- **Secondary pages** (`/skills`, `/faq`) stay as pages, linked from dashboard cards and the footer — not in the main nav.
- **About merge:** `/about-me` content wins (richer, on-theme). It moves to `/about`; `/about-me` becomes a 301 redirect. The old blue-themed `/about` page is removed.
- **Footer:** secondary links + social profiles, present on all pages.

### 1b. Dashboard Zones

The dashboard (the real hub — `/` boot screen redirects here) is reorganized from one undifferentiated bento wall into labeled zones. Existing card designs stay unchanged; zones add terminal-style section headers (`$ ls ~/proof`) for scannability:

| Zone | Header | Contents |
|---|---|---|
| Identity | `~/whoami` | profile, skills toggles, socials (as-is) |
| Recognition | `~/proof` | Featured hero card (research, press, awards) — keeps 2×2 hero size |
| Output | `~/work` | Projects card + Security Research card side-by-side (distinct things, one zone) |
| Writing | `~/write` | Articles strip + Notes link |
| Misc | `~/etc` | Extracurricular, FAQ, Contact |

Rationale: Featured = external validation (proof); Projects = built output; Security = research output. Different categories must read as different, without redesigning the cards.

Nav uses current page names: `About · Featured · Projects · Security · Articles · Contact` (zone taxonomy is dashboard-internal, not nav labels).

### 2. Design Tokens

Tailwind theme extension (`tailwind.config.ts`):

| Token | Value | Replaces |
|---|---|---|
| `terminal.green` | `#2ed573` | primary accent |
| `terminal.soft` | `#7bed9f` | gradient partner |
| `terminal.amber` | `#e1b12c` | warning/highlight |
| `terminal.red` | `#ff6b6b` | error/danger |
| `surface.base` | `#121212` | page background |
| `surface.raised` | `#0f0f0f` | cards/panels |
| `surface.border` | `rgba(46,213,115,0.2)` | borders |

All hardcoded hexes replaced with token classes, page by page. Traffic-light dots (`#ff5f57`/`#ffbd2e`/`#28ca41`) stay literal inside `TerminalHeader` only.

**Shared components:**
- `PageShell` — background, grid-dots, max-width container, optional `TerminalHeader`.
- `SiteNav` — persistent header.
- `Footer` — secondary links + socials.
- `BackLink` — the `cd ../` style back button.

### 3. Server Component Conversion

| Route | Target |
|---|---|
| `/skills`, `/faq`, `/featured`, `/security-research`, merged `/about` | Server components; interactive bits (tabs, typing effect) extracted to small client islands |
| `/projects`, `/contact`, `/dashboard` | Stay client (real interactivity: GitHub fetch, forms) |

### 4. Performance + SEO

- Less client JS from conversions.
- `next/image` wherever raw `<img>` is used.
- Metadata audit per route — layouts already carry metadata; verify and fill gaps for merged/changed routes.
- 301 redirect `/about-me` → `/about` (next.config or route-level redirect).
- Sitemap reflects merged structure; existing RSS/JSON-LD untouched.

### 5. Error Handling / Risk

- Redirect must be permanent (301) so search engines transfer authority from `/about-me`.
- Client→server conversions risk hydration/interaction regressions — each converted page verified in browser, not just build.

### 6. Verification

- `next build` clean after each phase.
- playwright-cli visual pass on every route (before/after screenshots): `/`, `/about`, `/projects`, `/articles`, `/blog`, `/notes`, `/security-research`, `/featured`, `/skills`, `/faq`, `/contact`.
- `/about-me` returns 301 → `/about`.
- Nav + footer render on all pages, links resolve.

## Decisions Log

- Focus: visitor-facing structure + visual polish + perf/SEO (not internal codebase reorg).
- Consolidation level: merge duplicates only (about pages); keep blog/notes/projects/featured distinct.
- Visual direction: polish existing terminal-green identity via tokens; no redesign.
- Approach: A — token-first polish.
- Dashboard reorganized into labeled zones (whoami/proof/work/write/etc); recent card designs preserved.
- Featured and Projects treated as distinct categories (recognition vs built output) — separate cards, `~/proof` vs `~/work` zones.
- Nav labels: current page names, not zone taxonomy.
