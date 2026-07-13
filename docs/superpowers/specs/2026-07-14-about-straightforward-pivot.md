# About Page Pivot 2 — Straightforward Professional / Terminal Theme

Supersedes the Gotham narrative layer. KEEP: interactive 3D city + signal backdrop,
scroll-scrubbed sky, theme split, scroll reveals, scrim panels, sr-only SEO bio.
REMOVE: all storytelling devices — loader title card, letterbox bars, film grain,
screenplay slugs, GOTHAM WATCH/CASE FILE stamps, diegetic clock (18:47…), noir copy.
Accent: site `terminal-green` token (theme-aware) replaces bat-yellow. Surfaces: site
`surface-deep` tokens. Font: site defaults + mono labels (Cormorant serif removed).

## Shared contract (content.ts) — both content and page agents implement to THIS:

```ts
export interface SectionCard { id: string; title: string; body: string; tags: string[] }
export interface SectionQuote { quote: string; note: string }
export interface SectionBeat { label: string; text: string }
export interface Section {
  id: string;
  label: string;          // "01 · WHO I AM" style mono label
  title: string;
  paragraphs: string[];
  cards?: SectionCard[];  // section index 3 only (4 cards, ids appsec/devops/ai/product)
  beats?: SectionBeat[];  // section index 4 only (PLAN/BUILD/SECURE/AUTOMATE)
  quotes?: SectionQuote[];// section index 4 only (3, notes unchanged)
  align: "center" | "left";
}
export const SECTIONS: Section[]  // exactly 6
export const CARD_COLOR: Record<string, string>  // keys unchanged
export const LINKS  // unchanged values
// clockAt, times, slugs: DELETED
```

Section labels: 01 · WHO I AM / 02 · BACKGROUND / 03 · SECURITY / 04 · WHAT I DO /
05 · HOW I WORK / 06 · CONTACT. Copy: direct, professional, first person, no metaphors.

REQUIRED VISIBLE FACTS (user demand — must appear in section copy, not only sr-only):
- Current position: Application Security Engineer at **Startise**, working on the **xCloud** hosting platform (section 01)
- MIST graduate, former President of MIST Cyber Security Club (section 02)
- 9 CVEs via Patchstack VDP; co-author of peer-reviewed research in Array (Elsevier, Q1) (section 03)

## File ownership (parallel)
- content agent: components/about/content.ts + tests/about-content.test.ts (rewrite test to new contract; delete clockAt tests)
- page agent: app/about/page.tsx + app/about/layout.tsx (remove Cormorant, restore fragment) + app/globals.css (remove .font-cinema + about-grain blocks) + `rm components/about/loader.tsx components/about/grain.tsx`
- palette agent: components/about/sky-palette.ts (dark `sun` → terminal green [0.24, 0.75, 0.47]; light `sun` stays pale; skies unchanged)
- scene agent: components/about/sky-scene.tsx (cone/apex → theme green #3cbf78 dark / #6b7f93 light; bokeh window points → #9fd4b4 dark / keep pale light; everything else unchanged)
