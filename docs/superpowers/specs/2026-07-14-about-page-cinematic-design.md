# About Page Redesign — "Before Sunrise" Cinematic Night-Walk

**Date:** 2026-07-14
**Status:** Approved (design), pending implementation plan
**Route:** `/about` (full replacement of current page)

## Concept

The About page becomes one continuous night in a city, told like *Before Sunrise*:
a stranger gets off a train at dusk, walks all night, and parts at sunrise.
Scroll = time passing. A fixed WebGL sky behind the content continuously
interpolates from dusk gold → deep night → pale sunrise as the visitor scrolls.
All existing biographical facts survive, retold as six film scenes.

Inspiration for craft level (not content): https://thevertmenthe.dault-lafon.fr/
— loader title card, minimal editorial overlay, immersive canvas, sparse elegance.

## Decisions (locked)

| Decision | Choice |
|----------|--------|
| Elements adopted from reference | Loader intro, minimal editorial overlay, scroll-driven story, WebGL scene |
| Content | Full narrative rewrite (same facts, film-scene voice) |
| 3D scene | Atmospheric sky + light only (no literal props) |
| Theme | Respects site theme toggle — dark = *Before Sunrise* (night walk), light = *Before Sunset* (golden afternoon) |
| Scope | Replaces `/about` entirely; loader plays once per session (`sessionStorage`) |
| Architecture | Approach A — scroll-scrubbed continuous sky (one fixed R3F canvas, scroll progress drives shader uniforms) |

## Story Structure

Loader (first visit per session): black screen, "EASIN ARAFAT" in serif,
thin line draws across, and a clock counter ticks from 00:00 to 18:47 (the
night's start time) with subtitle "one night, six scenes" — film-opening title card.
Skipped on subsequent visits within the session.

Six scenes, each a full-height chapter with a screenplay slug-line header:

| # | Slug line | Time | Content source |
|---|-----------|------|----------------|
| 01 | INT. TRAIN — DUSK | 18:47 | Hero: name, disciplines, thesis. "Every story starts with someone deciding to get off the train." |
| 02 | EXT. FIRST STREETS — GOLDEN HOUR | 20:15 | Origins: self-taught, browser + stubbornness (current ARC Rev A) |
| 03 | INT. RECORD BOOTH — NIGHT | 22:30 | The turn: security, learning to break things (ARC Rev B) |
| 04 | EXT. FERRIS WHEEL — NIGHT | 00:45 | The four disciplines (AppSec / DevOps / AI / R&D) as "the city from above" — interactive cards with narrative intro |
| 05 | EXT. THE LONG WALK — PRE-DAWN | 03:20 | Doctrine quotes styled as film subtitles + Plan/Build/Secure/Automate method as dialogue beats |
| 06 | EXT. SUNRISE — DAWN | 05:58 | Now (AI frontier, ARC Rev C) + contact links. "Before sunrise, say something." |

- Progress rail: replaces dots with a vertical clock timeline `18:47 ──●── 05:58`;
  marker position tracks scroll.
- The sr-only authoritative SEO bio block from the current page is preserved verbatim.
- Back link to `/dashboard` preserved (restyled to match).

## Visual Language

- **Typography:** Cormorant Garamond (serif display, via `next/font/google`) for
  scene titles and narrative lines; existing mono for slug lines and small labels.
  Two fonts max. Body text stays on the site body font.
- **Letterbox:** thin cinematic bars fixed top/bottom, fade in after loader.
- **Slug lines** replace the current `FIG. 0X` labels:
  `SCENE 04 · EXT. FERRIS WHEEL — NIGHT · 00:45` in mono caps, amber accent.
- **Subtitles:** doctrine quotes rendered as film subtitles — centered,
  lower-third placement within their chapter, subtle text shadow.
- **Film grain:** CSS/SVG noise overlay at low opacity across the page;
  static (non-animated) when `prefers-reduced-motion`.
- **Scene reveals:** keep IntersectionObserver fade/lift pattern from current
  page, slower cinematic easing (~900ms).
- **Accent palette:** amber/gold family replaces current sky-blue accents.

### Theme behavior

Same scenes and copy in both themes; only sky palette + accents shift.

- **Dark (Before Sunrise):** dusk gold → deep night (stars + city bokeh) → pale dawn.
- **Light (Before Sunset):** bright warm afternoon → golden hour → sunset amber.
- Theme read from `next-themes`; palette keyframe set swaps accordingly.

## WebGL Sky (Approach A)

- One fixed `<Canvas>` (R3F) behind the DOM, replacing `HoloExperience`.
- **Shader plane** (fullscreen): sky gradient computed from 6 authored color
  keyframes per theme, continuously interpolated by scroll progress `0→1`.
  Sun/moon disc rendered in the same shader; its arc position is a function of
  scroll progress.
- **Stars:** point cloud, opacity peaks mid-scroll (dark theme only).
- **City bokeh:** soft particle field near the horizon, night scenes only.
- **Dust motes:** sparse drifting particles, always on, very subtle.
- **Performance:** scroll progress read in `useFrame` and written directly to
  uniforms (damped/lerped) — no React re-render per scroll frame. DPR capped.
- **Fallbacks (kept from current page):** no WebGL or `prefers-reduced-motion`
  → static CSS gradient backdrop that steps per active chapter. `mode`
  detection logic reused (`pending | 3d | static`).

## Files

| File | Action |
|------|--------|
| `app/about/page.tsx` | Rewrite: loader gate, letterbox, clock rail, six scene chapters |
| `components/about/content.ts` | Rewrite: `SCENES` data (slug, time, title, copy, structured card/quote data), keep `LINKS`; discipline data restructured into scene 04 |
| `components/about/sky-experience.tsx` | New: canvas wrapper, scroll-progress plumbing, theme keyframe selection |
| `components/about/sky-scene.tsx` | New: shader plane, star/bokeh/dust particles, palette keyframes |
| `components/about/loader.tsx` | New: title-card intro, `sessionStorage` gate |
| `components/about/grain.tsx` | New: noise overlay |
| `components/about/holo-experience.tsx` | Delete (replaced) |
| `components/about/holo-scene.tsx` | Delete (replaced) |

No new dependencies — `three`, `@react-three/fiber`, `@react-three/drei`
already installed. Font loaded via `next/font/google`.

## Error Handling / Edge Cases

- WebGL context creation failure → static backdrop (existing pattern).
- `prefers-reduced-motion` → static backdrop, no grain animation, loader
  reduced to a quick fade (no counter animation).
- SSR: canvas dynamically imported with `ssr: false` (existing pattern);
  scenes render server-side as plain DOM for SEO.
- Mobile: DPR capped, particle counts reduced below `md` breakpoint;
  letterbox bars thinner; clock rail hidden (as dots rail is today).
- `sessionStorage` unavailable (private mode edge) → loader plays; failure to
  write is swallowed.

## Testing

- **Unit (vitest):** `SCENES` structure integrity (6 scenes, required fields,
  chronological times); palette keyframe interpolation function (pure TS —
  correct lerp at 0, 0.5, 1; both themes).
- **E2E (playwright-cli, session-isolated):** page renders all six slug lines;
  scroll advances clock rail; theme toggle swaps palette class; loader shows
  first visit, skipped second visit in same session; reduced-motion emulation
  gets static backdrop; no console errors.
- Build check: `tsc --noEmit` + `next build` clean.

## Out of Scope

- No changes to other routes, nav, or global theme system.
- No audio/soundtrack.
- No literal 3D props (train, ferris wheel models).
- No CMS — content stays in `content.ts`.
