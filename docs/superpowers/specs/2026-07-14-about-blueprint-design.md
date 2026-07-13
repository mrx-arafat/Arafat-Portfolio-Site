# About — "The Architect's Blueprint"

**Date:** 2026-07-14
**Status:** Approved by user
**Route:** `/about`

## Problem

Current about page is another terminal window (green-on-dark, matrix rain, tester-flavored language: "analyze", "validate", "examine"). It reads as QA-adjacent — a framing the user explicitly rejects. Goal: a distinct, creative page that portrays Easin Arafat as a strategic, capable-of-everything mind — plans it, builds it, breaks it, secures it, automates it — and keeps outrunning the field.

## Identity (authoritative framing)

- **Application Security Engineer** at Startise (xCloud) — primary identity.
- Also DevOps, automation, R&D, sometimes development. Strategic generalist.
- **Never use the word "QA."** Testing is fine to mention; "QA" is not.
- Portray: genius-level breadth, growth mindset, well-read strategist, ahead of the AI curve.
- Real GitHub work informs wording but is referenced aspirationally — no repo lists, no star counts.

## Theme & Visual Language

Architect's blueprint. Dark drafting paper (deep blue-charcoal `#0a1017`-ish), fine cyan blueprint grid, technical-drawing aesthetic: thin lines, dimension ticks, corner title-block, annotated callouts. Blueprint cyan accent + amber for emphasis. NO terminal green (this page is its own world). Monospace for labels/annotations, editorial sans for body prose. Full light/dark support — blueprint inverts to dark ink on blue-tinted white paper in light mode.

## Sections

1. **Title block / hero** — blueprint sheet header. "EASIN ARAFAT — Application Security Engineer · DevOps · R&D". Thesis line: "I don't work in one box. I plan it, build it, break it, then make it survive production." Rotating discipline chips. Line-draw intro animation (grid fades up, title-block lines draw via stroke-dashoffset).

2. **The blueprint — how I think** (centerpiece). Schematic `PLAN → BUILD → SECURE → AUTOMATE` as connected nodes on the grid with dimension lines. Scroll/hover reveals one capability-sentence callout per node.

3. **Discipline panels** — blueprint "detail views": Application Security, DevOps & Automation, AI & Agents, R&D / Product. Each = short aspirational paragraph + capability tags.

4. **Doctrine / the mind behind it** — strategist + reader angle. Editorial pull-quotes on growth mindset, systems thinking, reading, outrunning the field.

5. **The arc** — compact timeline as blueprint revision history: REV A self-taught → REV B security → REV C AI frontier.

6. **CTA footer** — GitHub / LinkedIn / contact, styled as the sheet's title-block footer.

## Architecture

| File | Role |
|------|------|
| `app/about/page.tsx` | Rewrite. Blueprint paper shell, section composition, back link, sr-only SEO bio preserved |
| `components/about/blueprint-grid.tsx` | Reusable grid + paper background, theme-aware |
| `components/about/blueprint-hero.tsx` | Title-block hero, line-draw animation, rotating chips |
| `components/about/thinking-schematic.tsx` | PLAN→BUILD→SECURE→AUTOMATE node schematic with callouts |
| `components/about/discipline-panel.tsx` | Detail-view panel (reused per discipline) |
| `components/about/doctrine.tsx` | Pull-quote doctrine section |
| `components/about/arc-timeline.tsx` | Revision-history timeline |
| `components/about/content.ts` | Copy/data (disciplines, doctrine lines, arc revisions, capability callouts) |

No new deps. SVG line-draw via CSS `stroke-dashoffset`; scroll reveals via IntersectionObserver; `prefers-reduced-motion` respected.

## Accessibility & Light Mode

- Blueprint decoration is `aria-hidden`; content is real semantic DOM (h1/h2, prose).
- Text contrast ≥ 4.5:1 in both themes; blueprint inverts (dark ink on tinted-white paper) in light mode.
- Preserve existing sr-only authoritative bio for entity/name SEO.
- Preserve back-to-dashboard link and click sound.

## Out of Scope

- No changes to other routes.
- No CMS; copy lives in `content.ts`.
- No repo lists / star counts anywhere.

## Success Criteria

- Reads as a strategic, do-everything mind — not a QA tester.
- Feels visually distinct from the skills galaxy.
- Works and is legible in both light and dark themes.
- Line-draw / reveal animations run; reduced-motion users get a complete static page.
