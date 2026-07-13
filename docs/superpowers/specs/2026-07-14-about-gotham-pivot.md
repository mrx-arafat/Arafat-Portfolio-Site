# About Page Pivot — Gotham / Batman Night-Watch (supersedes Before Sunrise theme)

**Date:** 2026-07-14 · **Status:** Approved by user (fast-track)
**Base:** Cinematic architecture from 2026-07-14-about-page-cinematic-design.md is KEPT
(loader, six-scene scroll, scroll-scrubbed WebGL sky, grain, clock rail, theme split).
Only theme skin + narrative change.

## Locked decisions
- Motif: bat-signal searchlight beam + dark city skyline silhouette in the WebGL sky. No bat logos in copy.
- Accent: bat-yellow **#ffd60a** replaces all amber/gold accents.
- Dark mode = Gotham night (near-black blues, storm greys, sodium city glow, signal brightest mid-scroll).
- Light mode = Gotham dawn (cold grey-blue mist → overcast steel day). Same scenes/copy.
- Narrative: six scenes retold as one night's watch over the city (vigilante-engineer metaphor, same biographical facts, same times 18:47…05:58, same card ids / beat labels / quote notes).
- Fonts: keep Cormorant Garamond + mono. Grain kept. Clock rail kept ("night watch").
- Loader: same logic/timing (post-review version preserved), colors → bat-yellow on black.

## File partition (all disjoint — parallel-safe)
- A `components/about/sky-palette.ts` (+ its test): new NIGHT/DAY keyframes, same SkyStop shape & function signatures. Tests must keep passing (ranges, darkest+starriest mid-scroll for night, endpoints, lerp midpoint, cssBackdrop format).
- B `components/about/content.ts`: Gotham narrative rewrite. Same interfaces, same times, same card ids (appsec/devops/ai/product), same beat labels (PLAN/BUILD/SECURE/AUTOMATE), same 3 quote notes, LINKS untouched. Existing tests must pass unchanged.
- C `components/about/sky-scene.tsx`: skyline silhouette + bat-signal beam + cloud-spot in fragment shader (uniform names unchanged; uSunY/uSunI now drive the signal). Fix inverted smoothstep (`1.0 - smoothstep(0.35, 1.25, d)`).
- D `components/about/loader.tsx`: color-only restyle to bat-yellow; logic untouched.
- E `app/about/page.tsx`: accent classes amber→bat-yellow; page bg dark #050608 / light #dfe6ee; plus 3 review minors: clock-rail nav→div, card h3→p (styled same), paragraph keys → index-based.

## Out of scope
- No structure/timing changes, no new deps, no route changes, sr-only bio untouched.
