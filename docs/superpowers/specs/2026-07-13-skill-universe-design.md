# Skill Universe — Skills Page Redesign

**Date:** 2026-07-13
**Status:** Approved by user
**Route:** `/skills`

## Problem

Current skills page is a static badge grid with category filter buttons. No story, no motion, no reason to stay. Goal: a creative experience that makes *any* visitor (not just technical people) scroll the whole page and remember it.

## Concept

A 3D "Skill Universe": a glowing core star (Arafat) orbited by 9 planets — one per skill category. The galaxy is the hook; scroll-driven story sections below provide the depth. Clicking a planet flies the camera toward it and smooth-scrolls to that category's section, making the 3D scene the page's navigation.

## Section 1 — Galaxy Hero

- Full-width Three.js scene, ~80vh.
- Center: emissive core star with sprite halo.
- 9 planets orbit on slightly varied inclined orbits. One per category:

| Category | Hue |
|----------|-----|
| security | crimson |
| development | cyan |
| ai | violet |
| devops | amber |
| database | teal |
| automation | orange |
| testing | lime |
| business | gold |
| soft-skill | rose |

- Planet radius scales with category skill count.
- Ambience: slow idle auto-rotation, drifting parallax starfield, soft nebula backdrop (texture/gradient, not postprocessing).

### Interactions

- Drag / touch-drag = orbit camera.
- Hover planet = glow ring + floating name label.
- Click/tap planet = brief camera dip toward planet, then smooth scroll to that category's section below.

## Section 2 — Story Sections

- One section per category, in defined order, background subtly tinted with the planet's hue.
- Section header: small planet orb (CSS/canvas), category display name, one-line human tagline (e.g. "Security — I break things so they can't be broken").
- Skill cards: icon (existing lucide icons), name, description. Staggered fade-up reveal via IntersectionObserver.
- Flagship skills (e.g. WordPress CVE research) render as larger glow-border cards with a "★ notable" mark.
- Side nav: fixed colored dot per category, indicates scroll position, click jumps to section.

## Data Model

Extend `data/skills.json` (skill entries untouched):

```json
{
  "categories": [
    {
      "id": "security",
      "label": "Security",
      "tagline": "I break things so they can't be broken",
      "color": "#e5484d",
      "order": 1
    }
  ],
  "skills": [ /* existing; add optional "flagship": true */ ]
}
```

## Architecture

| File | Role |
|------|------|
| `app/skills/page.tsx` | Rewrite. Page shell, section layout, side nav |
| `components/skills/galaxy-hero.tsx` | Client comp via `next/dynamic` `ssr:false`. R3F scene: star, planets, starfield, controls, click→scroll callback |
| `components/skills/category-section.tsx` | Tinted section, header, card grid, reveal animation |
| `components/skills/skill-card.tsx` | Card (normal + flagship variants) |
| `data/skills.json` | Add `categories` block + flagship flags |

**New deps (pnpm):** `three`, `@react-three/fiber`, `@react-three/drei`.

## Performance

- Three.js only in the dynamically imported hero chunk; never in server bundle or other routes.
- No postprocessing bloom. Glow = emissive materials + additive sprite halos.
- `devicePixelRatio` capped at 2.
- Render loop pauses when hero scrolled out of view (IntersectionObserver + R3F `frameloop`).
- Mobile: reduced star count, low-poly spheres.

## Fallbacks & Accessibility

- No WebGL or `prefers-reduced-motion`: static CSS starfield + colored planet chips linking to sections. No auto-motion anywhere in this mode.
- Canvas `aria-hidden="true"`; visually-hidden list of category anchor links mirrors planet navigation.
- Story sections are plain DOM → SEO and screen readers unaffected.
- Existing click-sound integration + mute button preserved.

## Out of Scope

- Other routes/pages untouched.
- No CMS/admin for skills; JSON stays source of truth.
- No sound design beyond existing click sound.

## Success Criteria

- Visitor without technical background can navigate galaxy by drag + click on first try.
- Planet click lands on correct section with camera dip animation.
- Lighthouse perf on /skills stays reasonable on mobile (hero lazy-loaded, no layout shift below fold).
- Reduced-motion and no-WebGL users get a complete, attractive static page.
