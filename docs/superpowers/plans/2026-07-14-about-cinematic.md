# About Page "Before Sunrise" Cinematic Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `/about` with a cinematic scroll-driven night-walk: loader title card, six film scenes, and a WebGL sky that continuously interpolates dusk → night → sunrise with scroll.

**Architecture:** One fixed R3F canvas behind DOM chapters. Scroll progress (0→1) is read in `useFrame` and written straight to shader uniforms (no React re-render per frame). Sky colors come from 6 authored keyframes per theme, sampled by a pure, unit-tested interpolation function. DOM chapters reuse the existing IntersectionObserver reveal pattern.

**Tech Stack:** Next 16 (App Router), React 19, TypeScript strict, Tailwind, three / @react-three/fiber (installed), next-themes, vitest, playwright-cli.

**Spec:** `docs/superpowers/specs/2026-07-14-about-page-cinematic-design.md`

## Global Constraints

- Package manager: **pnpm** (`pnpm-workspace.yaml` present). Never npm/yarn.
- **No new dependencies.** three/R3F/drei, next-themes already installed. Font via `next/font/google`.
- TypeScript: explicit return types on exports, no `any`.
- Vitest: `tests/**/*.test.ts`, node environment → unit tests cover **data + pure functions only** (no React component unit tests; UI verified by E2E in Task 7).
- Theme: `next-themes`, `attribute="class"`, `defaultTheme="dark"`. Read via `useTheme().resolvedTheme`.
- Preserve verbatim: sr-only SEO bio block, `LINKS` values, `app/about/layout.tsx` metadata/StructuredData (file untouched except font addition).
- Git: ask user once for commit permission at execution start; if not granted, skip every "Commit" step (work still proceeds).
- macOS BSD userland: no GNU sed; use Edit tool for file changes.

---

### Task 1: Scene content + clock utility (`content.ts` rewrite)

**Files:**
- Rewrite: `components/about/content.ts`
- Test: `tests/about-content.test.ts`

**Interfaces:**
- Produces (later tasks import from `@/components/about/content`):
  - `interface Scene { id: string; slug: string; time: string; title: string; paragraphs: string[]; cards?: SceneCard[]; quotes?: SceneQuote[]; beats?: SceneBeat[]; align: "center" | "left" }`
  - `interface SceneCard { id: string; title: string; body: string; tags: string[] }`
  - `interface SceneQuote { quote: string; note: string }`
  - `interface SceneBeat { label: string; text: string }`
  - `const SCENES: Scene[]` (length 6)
  - `const CARD_COLOR: Record<string, string>`
  - `const LINKS` (unchanged values)
  - `function clockAt(progress: number): string` — maps scroll 0→1 to "HH:MM" between 18:47 and 05:58 (crosses midnight)

- [ ] **Step 1: Write the failing test**

Create `tests/about-content.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { SCENES, LINKS, clockAt } from "@/components/about/content";

describe("SCENES", () => {
  it("has exactly six scenes with required fields", () => {
    expect(SCENES).toHaveLength(6);
    for (const s of SCENES) {
      expect(s.id).toBeTruthy();
      expect(s.slug).toMatch(/^(INT|EXT)\./);
      expect(s.time).toMatch(/^\d{2}:\d{2}$/);
      expect(s.title).toBeTruthy();
      expect(s.paragraphs.length).toBeGreaterThan(0);
    }
  });

  it("runs chronologically through the night", () => {
    expect(SCENES.map((s) => s.time)).toEqual([
      "18:47", "20:15", "22:30", "00:45", "03:20", "05:58",
    ]);
  });

  it("scene 4 carries the four disciplines, scene 5 the doctrine", () => {
    expect(SCENES[3].cards?.map((c) => c.id)).toEqual([
      "appsec", "devops", "ai", "product",
    ]);
    expect(SCENES[4].quotes).toHaveLength(3);
    expect(SCENES[4].beats?.map((b) => b.label)).toEqual([
      "PLAN", "BUILD", "SECURE", "AUTOMATE",
    ]);
  });

  it("keeps contact links", () => {
    expect(LINKS.github).toBe("https://github.com/mrx-arafat");
    expect(LINKS.linkedin).toBe("https://www.linkedin.com/in/e4rafat");
    expect(LINKS.contact).toBe("/contact");
  });
});

describe("clockAt", () => {
  it("starts at 18:47 and ends at 05:58", () => {
    expect(clockAt(0)).toBe("18:47");
    expect(clockAt(1)).toBe("05:58");
  });

  it("crosses midnight around the middle", () => {
    // total span = 671 min; 0.5 → Math.round(335.5) = 336 → 18:47 + 336 min = 00:23
    expect(clockAt(0.5)).toBe("00:23");
  });

  it("clamps out-of-range progress", () => {
    expect(clockAt(-1)).toBe("18:47");
    expect(clockAt(2)).toBe("05:58");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run tests/about-content.test.ts`
Expected: FAIL — `SCENES` / `clockAt` not exported.

- [ ] **Step 3: Rewrite `components/about/content.ts`**

Full replacement:

```ts
/** Narrative content for the cinematic About page — one night, six scenes. */

export interface SceneCard {
  id: string;
  title: string;
  body: string;
  tags: string[];
}

export interface SceneQuote {
  quote: string;
  note: string;
}

export interface SceneBeat {
  label: string;
  text: string;
}

export interface Scene {
  id: string;
  /** Screenplay slug line, e.g. "EXT. FERRIS WHEEL — NIGHT". */
  slug: string;
  /** Diegetic time of night, "HH:MM". */
  time: string;
  title: string;
  paragraphs: string[];
  cards?: SceneCard[];
  quotes?: SceneQuote[];
  beats?: SceneBeat[];
  align: "center" | "left";
}

export const SCENES: Scene[] = [
  {
    id: "train",
    slug: "INT. TRAIN — DUSK",
    time: "18:47",
    title: "EASIN ARAFAT",
    paragraphs: [
      "Every good story starts with someone deciding to get off the train.",
      "Application security. DevOps. Automation. AI and agents. I don't work in one box — I plan it, build it, break it, then make it survive production.",
    ],
    align: "center",
  },
  {
    id: "streets",
    slug: "EXT. FIRST STREETS — GOLDEN HOUR",
    time: "20:15",
    title: "The first streets",
    paragraphs: [
      "It began with nothing but a browser and stubbornness. No degree map, no mentor — front-end first, then full-stack, one project at a time until the fundamentals were mine.",
      "Self-taught isn't a gap in the story. It's the plot.",
    ],
    align: "left",
  },
  {
    id: "booth",
    slug: "INT. RECORD BOOTH — NIGHT",
    time: "22:30",
    title: "The turn",
    paragraphs: [
      "Somewhere in the small hours, the fascination flipped: not how things are built — how they break.",
      "Cryptography from scratch. CTFs. Recon tooling. Real vulnerability research. Learning to break things so I could build them stronger.",
    ],
    align: "left",
  },
  {
    id: "wheel",
    slug: "EXT. FERRIS WHEEL — NIGHT",
    time: "00:45",
    title: "The city from above",
    paragraphs: [
      "From up here the work looks like four districts of one city, lit all night.",
    ],
    cards: [
      {
        id: "appsec",
        title: "Application Security",
        body: "My core discipline. I think like an attacker so systems don't have to learn the hard way — probing where assumptions break, where isolation leaks, and where privilege drifts under real production load.",
        tags: ["offensive security", "threat modeling", "exploitation", "hardening"],
      },
      {
        id: "devops",
        title: "DevOps & Automation",
        body: "I live in the pipeline between code and infrastructure — containers, networks, deployment flows — and turn complex backend work into secure, repeatable, one-click product features.",
        tags: ["CI/CD", "infrastructure", "orchestration", "observability"],
      },
      {
        id: "ai",
        title: "AI & Agents",
        body: "The field moves fast; I move faster. I build with LLMs and multi-agent systems as engineering, not hype — research, orchestration, and tooling that make everything else compound.",
        tags: ["LLM tooling", "agent orchestration", "AI automation", "R&D"],
      },
      {
        id: "product",
        title: "R&D & Product",
        body: "Sometimes I'm the mastermind behind a feature — the one who thinks it up, plans it, and makes it happen. Security, DevOps, AI are tools; the real work is shipping solutions that hold.",
        tags: ["product thinking", "prototyping", "systems design", "strategy"],
      },
    ],
    align: "left",
  },
  {
    id: "walk",
    slug: "EXT. THE LONG WALK — PRE-DAWN",
    time: "03:20",
    title: "The conversation",
    paragraphs: [
      "The best hours are the ones where the talk goes past the surface. This is how mine goes.",
    ],
    beats: [
      {
        label: "PLAN",
        text: "It starts as strategy, not code. I map the problem, the blast radius, and the shortest honest path before touching a keyboard.",
      },
      {
        label: "BUILD",
        text: "Then I make it real. Full-stack, infrastructure, tooling — whatever the problem actually needs, shipped to production, not to a demo.",
      },
      {
        label: "SECURE",
        text: "Offensive security is the trade. I find the gap the way an attacker would — before it ever reaches a user.",
      },
      {
        label: "AUTOMATE",
        text: "If it happens twice, a machine does it next. I turn fragile manual chains into repeatable, observable systems.",
      },
    ],
    quotes: [
      {
        quote:
          "Most failures aren't bad code. They're systems behaving differently under real conditions. I work in that gap.",
        note: "SYSTEMS THINKING",
      },
      {
        quote:
          "I don't define myself by one domain. Give me the problem — I'll learn the parts I'm missing faster than the problem can wait.",
        note: "GROWTH MINDSET",
      },
      {
        quote:
          "Strategy comes from reading widely — code is only half of it. The other half is knowing why people build, break, and decide the way they do.",
        note: "THE LONG GAME",
      },
    ],
    align: "center",
  },
  {
    id: "sunrise",
    slug: "EXT. SUNRISE — DAWN",
    time: "05:58",
    title: "Before sunrise, say something",
    paragraphs: [
      "Now I build at the edge of AI and automation while most of the field is still catching up — agents, orchestration, R&D that compounds everything before it.",
      "Have a problem worth solving? That's the part I like most.",
    ],
    align: "center",
  },
];

/** Accent per discipline card (scene 04). */
export const CARD_COLOR: Record<string, string> = {
  appsec: "#f87171",
  devops: "#38bdf8",
  ai: "#a78bfa",
  product: "#fbbf24",
};

export const LINKS = {
  github: "https://github.com/mrx-arafat",
  linkedin: "https://www.linkedin.com/in/e4rafat",
  contact: "/contact",
} as const;

const NIGHT_START = 18 * 60 + 47; // 18:47
const NIGHT_END = 5 * 60 + 58; // 05:58 next day
const NIGHT_SPAN = 24 * 60 - NIGHT_START + NIGHT_END; // 671 minutes

/** Diegetic clock: scroll progress 0→1 mapped onto 18:47 → 05:58. */
export function clockAt(progress: number): string {
  const t = Math.min(1, Math.max(0, progress));
  const minutes = (NIGHT_START + Math.round(t * NIGHT_SPAN)) % (24 * 60);
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run tests/about-content.test.ts`
Expected: PASS (7 tests). Note: `app/about/page.tsx` still imports old names (`HERO` etc.) — the page breaks type-check until Task 6; that's expected mid-plan. Vitest only compiles the test's import graph, so this test passes now.

- [ ] **Step 5: Commit**

```bash
git add components/about/content.ts tests/about-content.test.ts
git commit -m "feat(about): rewrite content as six-scene night narrative with clock utility"
```

---

### Task 2: Sky palette keyframes + interpolation (pure module)

**Files:**
- Create: `components/about/sky-palette.ts`
- Test: `tests/about-sky-palette.test.ts`

**Interfaces:**
- Produces:
  - `type Rgb = [number, number, number]` (0–1 floats)
  - `interface SkyStop { top: Rgb; mid: Rgb; bottom: Rgb; sun: Rgb; sunY: number; sunI: number; stars: number; bokeh: number }`
  - `const NIGHT_KEYFRAMES: SkyStop[]` (6) — dark theme, Before Sunrise
  - `const DAY_KEYFRAMES: SkyStop[]` (6) — light theme, Before Sunset
  - `function sampleSky(frames: SkyStop[], t: number): SkyStop` — clamped piecewise-linear sample
  - `function cssBackdrop(frames: SkyStop[], t: number): string` — CSS linear-gradient string for the static fallback

- [ ] **Step 1: Write the failing test**

Create `tests/about-sky-palette.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import {
  NIGHT_KEYFRAMES,
  DAY_KEYFRAMES,
  sampleSky,
  cssBackdrop,
} from "@/components/about/sky-palette";

describe("keyframes", () => {
  it("both themes have six stops with sane ranges", () => {
    for (const frames of [NIGHT_KEYFRAMES, DAY_KEYFRAMES]) {
      expect(frames).toHaveLength(6);
      for (const f of frames) {
        for (const c of [...f.top, ...f.mid, ...f.bottom, ...f.sun]) {
          expect(c).toBeGreaterThanOrEqual(0);
          expect(c).toBeLessThanOrEqual(1);
        }
        expect(f.stars).toBeGreaterThanOrEqual(0);
        expect(f.stars).toBeLessThanOrEqual(1);
      }
    }
  });

  it("night sky is darkest and starriest mid-scroll", () => {
    const mid = sampleSky(NIGHT_KEYFRAMES, 0.5);
    const start = sampleSky(NIGHT_KEYFRAMES, 0);
    expect(mid.top[2]).toBeLessThan(start.top[2]);
    expect(mid.stars).toBeGreaterThan(start.stars);
  });
});

describe("sampleSky", () => {
  it("returns exact endpoint frames at t=0 and t=1", () => {
    expect(sampleSky(NIGHT_KEYFRAMES, 0)).toEqual(NIGHT_KEYFRAMES[0]);
    expect(sampleSky(NIGHT_KEYFRAMES, 1)).toEqual(NIGHT_KEYFRAMES[5]);
  });

  it("clamps t outside [0,1]", () => {
    expect(sampleSky(NIGHT_KEYFRAMES, -0.5)).toEqual(NIGHT_KEYFRAMES[0]);
    expect(sampleSky(NIGHT_KEYFRAMES, 1.5)).toEqual(NIGHT_KEYFRAMES[5]);
  });

  it("interpolates linearly between adjacent frames", () => {
    // 6 frames → segments of 0.2; t=0.5 is halfway between frames 2 and 3
    const s = sampleSky(NIGHT_KEYFRAMES, 0.5);
    const a = NIGHT_KEYFRAMES[2];
    const b = NIGHT_KEYFRAMES[3];
    expect(s.sunY).toBeCloseTo((a.sunY + b.sunY) / 2, 6);
    expect(s.top[0]).toBeCloseTo((a.top[0] + b.top[0]) / 2, 6);
  });
});

describe("cssBackdrop", () => {
  it("produces a linear-gradient with three rgb stops", () => {
    const css = cssBackdrop(NIGHT_KEYFRAMES, 0);
    expect(css).toMatch(/^linear-gradient\(to top, rgb\(/);
    expect(css.match(/rgb\(/g)).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run tests/about-sky-palette.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Create `components/about/sky-palette.ts`**

```ts
/** Authored sky keyframes + pure sampling. No three.js imports — unit-testable. */

export type Rgb = [number, number, number];

export interface SkyStop {
  top: Rgb;
  mid: Rgb;
  bottom: Rgb;
  sun: Rgb;
  /** Sun/moon vertical position in UV space (0 = horizon, 1 = zenith). */
  sunY: number;
  /** Sun glow intensity 0–1. */
  sunI: number;
  /** Star field opacity 0–1. */
  stars: number;
  /** City bokeh opacity 0–1. */
  bokeh: number;
}

/** Dark theme — Before Sunrise: dusk → deep night → pale dawn. */
export const NIGHT_KEYFRAMES: SkyStop[] = [
  { top: [0.10, 0.12, 0.25], mid: [0.55, 0.30, 0.18], bottom: [0.95, 0.55, 0.25], sun: [1.0, 0.75, 0.45], sunY: 0.28, sunI: 0.9, stars: 0.10, bokeh: 0.20 },
  { top: [0.05, 0.07, 0.18], mid: [0.25, 0.15, 0.20], bottom: [0.45, 0.25, 0.20], sun: [1.0, 0.65, 0.40], sunY: 0.12, sunI: 0.5, stars: 0.35, bokeh: 0.50 },
  { top: [0.01, 0.02, 0.06], mid: [0.03, 0.05, 0.12], bottom: [0.08, 0.09, 0.16], sun: [0.9, 0.9, 1.0], sunY: 0.05, sunI: 0.0, stars: 0.90, bokeh: 0.80 },
  { top: [0.01, 0.01, 0.05], mid: [0.02, 0.04, 0.10], bottom: [0.07, 0.08, 0.15], sun: [0.9, 0.9, 1.0], sunY: 0.05, sunI: 0.0, stars: 1.00, bokeh: 1.00 },
  { top: [0.03, 0.05, 0.14], mid: [0.10, 0.14, 0.25], bottom: [0.25, 0.28, 0.38], sun: [1.0, 0.85, 0.60], sunY: 0.08, sunI: 0.15, stars: 0.50, bokeh: 0.60 },
  { top: [0.35, 0.45, 0.65], mid: [0.85, 0.60, 0.45], bottom: [1.00, 0.80, 0.55], sun: [1.0, 0.85, 0.60], sunY: 0.22, sunI: 1.0, stars: 0.00, bokeh: 0.10 },
];

/** Light theme — Before Sunset: warm afternoon → golden hour → sunset amber. */
export const DAY_KEYFRAMES: SkyStop[] = [
  { top: [0.45, 0.65, 0.90], mid: [0.75, 0.82, 0.92], bottom: [0.95, 0.90, 0.80], sun: [1.0, 0.95, 0.80], sunY: 0.70, sunI: 0.7, stars: 0, bokeh: 0 },
  { top: [0.42, 0.60, 0.85], mid: [0.78, 0.78, 0.85], bottom: [0.96, 0.88, 0.74], sun: [1.0, 0.92, 0.72], sunY: 0.58, sunI: 0.75, stars: 0, bokeh: 0 },
  { top: [0.40, 0.52, 0.78], mid: [0.85, 0.75, 0.70], bottom: [0.98, 0.85, 0.62], sun: [1.0, 0.88, 0.62], sunY: 0.45, sunI: 0.8, stars: 0, bokeh: 0 },
  { top: [0.38, 0.45, 0.70], mid: [0.90, 0.70, 0.55], bottom: [1.00, 0.82, 0.55], sun: [1.0, 0.85, 0.55], sunY: 0.34, sunI: 0.9, stars: 0, bokeh: 0.05 },
  { top: [0.34, 0.38, 0.62], mid: [0.90, 0.62, 0.45], bottom: [1.00, 0.76, 0.48], sun: [1.0, 0.80, 0.50], sunY: 0.24, sunI: 0.95, stars: 0, bokeh: 0.10 },
  { top: [0.30, 0.30, 0.50], mid: [0.90, 0.55, 0.35], bottom: [1.00, 0.70, 0.40], sun: [1.0, 0.78, 0.45], sunY: 0.15, sunI: 1.0, stars: 0, bokeh: 0.15 },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

/** Clamped piecewise-linear sample of the keyframe track at t ∈ [0,1]. */
export function sampleSky(frames: SkyStop[], t: number): SkyStop {
  const clamped = Math.min(1, Math.max(0, t));
  const scaled = clamped * (frames.length - 1);
  const i = Math.min(frames.length - 2, Math.floor(scaled));
  const f = scaled - i;
  const a = frames[i];
  const b = frames[i + 1];
  if (f === 0) return { ...a };
  if (f === 1 || (i === frames.length - 2 && clamped === 1)) return { ...b };
  return {
    top: lerpRgb(a.top, b.top, f),
    mid: lerpRgb(a.mid, b.mid, f),
    bottom: lerpRgb(a.bottom, b.bottom, f),
    sun: lerpRgb(a.sun, b.sun, f),
    sunY: lerp(a.sunY, b.sunY, f),
    sunI: lerp(a.sunI, b.sunI, f),
    stars: lerp(a.stars, b.stars, f),
    bokeh: lerp(a.bokeh, b.bokeh, f),
  };
}

function rgbCss([r, g, b]: Rgb): string {
  const to255 = (v: number): number => Math.round(v * 255);
  return `rgb(${to255(r)}, ${to255(g)}, ${to255(b)})`;
}

/** Static-fallback CSS gradient for a given progress. */
export function cssBackdrop(frames: SkyStop[], t: number): string {
  const s = sampleSky(frames, t);
  return `linear-gradient(to top, ${rgbCss(s.bottom)}, ${rgbCss(s.mid)}, ${rgbCss(s.top)})`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run tests/about-sky-palette.test.ts`
Expected: PASS. Note: `sampleSky(frames, 1)` must return a copy equal to the last frame — the `scaled=5, i=4, f=1` path is covered by the explicit `clamped === 1` branch. `toEqual` compares structurally, so the `{ ...a }` copies pass.

- [ ] **Step 5: Commit**

```bash
git add components/about/sky-palette.ts tests/about-sky-palette.test.ts
git commit -m "feat(about): sky palette keyframes with pure interpolation + css fallback"
```

---

### Task 3: Loader title card

**Files:**
- Create: `components/about/loader.tsx`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `default export CinematicLoader({ onDone }: { onDone: () => void }): ReactElement | null`
  - Plays once per session (`sessionStorage` key `"about-loader-seen"`). If already seen → calls `onDone` immediately (in an effect) and renders `null`.
  - Reduced motion → short 500ms fade, no counter animation.
  - Full version ≈ 2.6s: serif name, growing line, clock counting 00:00 → 18:47, subtitle "one night, six scenes".

- [ ] **Step 1: Create `components/about/loader.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";

const SEEN_KEY = "about-loader-seen";
const TARGET_MIN = 18 * 60 + 47;
const DURATION_MS = 2200;
const HOLD_MS = 400;

function fmt(minutes: number): string {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
}

function alreadySeen(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen(): void {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* private mode — loader just replays next visit */
  }
}

/** Film-opening title card. Plays once per session, then reveals the page. */
export default function CinematicLoader({
  onDone,
}: {
  onDone: () => void;
}): ReactElement | null {
  const [phase, setPhase] = useState<"pending" | "playing" | "leaving" | "done">(
    "pending",
  );
  const [clock, setClock] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (alreadySeen()) {
      setPhase("done");
      doneRef.current();
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase("playing");
    markSeen();

    if (reduce) {
      setClock(TARGET_MIN);
      const t = window.setTimeout(() => setPhase("leaving"), 500);
      return () => window.clearTimeout(t);
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number): void => {
      const p = Math.min(1, (now - start) / DURATION_MS);
      const eased = 1 - Math.pow(1 - p, 3);
      setClock(Math.round(eased * TARGET_MIN));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setPhase("leaving"), HOLD_MS);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (phase !== "leaving") return;
    const t = window.setTimeout(() => {
      setPhase("done");
      doneRef.current();
    }, 700);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "done" || phase === "pending") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-700 ${
        phase === "leaving" ? "opacity-0" : "opacity-100"
      }`}
    >
      <h1 className="font-cinema text-4xl font-light tracking-[0.28em] text-amber-50 md:text-6xl">
        EASIN ARAFAT
      </h1>
      <div className="mt-6 h-px w-48 overflow-hidden bg-amber-50/20 md:w-72">
        <div
          className="h-full bg-amber-200/90"
          style={{
            width: `${(clock / TARGET_MIN) * 100}%`,
            transition: "width 120ms linear",
          }}
        />
      </div>
      <div className="mt-6 flex items-baseline gap-3 font-mono text-amber-50/80">
        <span className="text-2xl tabular-nums md:text-3xl">{fmt(clock)}</span>
        <span className="text-[10px] uppercase tracking-[0.3em] text-amber-50/50">
          one night, six scenes
        </span>
      </div>
    </div>
  );
}
```

Note: `font-cinema` utility arrives in Task 6 (font variable + Tailwind arbitrary class). Until Task 6 wires the page, this component is unused and unreferenced — type-check still passes because the class is just a string.

- [ ] **Step 2: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: errors ONLY in `app/about/page.tsx` (old imports from rewritten `content.ts` — fixed in Task 6). No errors in `loader.tsx`. If `page.tsx` noise obscures the check: `pnpm exec tsc --noEmit 2>&1 | grep -v "app/about/page.tsx"` should show no `loader.tsx` lines.

- [ ] **Step 3: Commit**

```bash
git add components/about/loader.tsx
git commit -m "feat(about): cinematic loader title card with session gate"
```

---

### Task 4: Film grain overlay

**Files:**
- Create: `components/about/grain.tsx`
- Modify: `app/globals.css` (append keyframes)

**Interfaces:**
- Produces: `default export FilmGrain(): ReactElement` — fixed, pointer-events-none, z-40 SVG-noise overlay; animation paused under `prefers-reduced-motion`.

- [ ] **Step 1: Create `components/about/grain.tsx`**

```tsx
import type { ReactElement } from "react";

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

/** Film-grain overlay across the whole page. */
export default function FilmGrain(): ReactElement {
  return (
    <div
      aria-hidden="true"
      className="about-grain pointer-events-none fixed inset-0 z-40 opacity-[0.07] mix-blend-overlay"
      style={{ backgroundImage: NOISE_SVG }}
    />
  );
}
```

- [ ] **Step 2: Append to `app/globals.css`**

```css
/* Cinematic about page — film grain shimmer */
@keyframes about-grain-shift {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-4%, 3%); }
  50% { transform: translate(3%, -4%); }
  75% { transform: translate(-3%, -3%); }
  100% { transform: translate(0, 0); }
}
.about-grain {
  animation: about-grain-shift 0.9s steps(4) infinite;
}
@media (prefers-reduced-motion: reduce) {
  .about-grain {
    animation: none;
  }
}
```

- [ ] **Step 3: Type-check + commit**

Run: `pnpm exec tsc --noEmit 2>&1 | grep -v "app/about/page.tsx"` — no new errors.

```bash
git add components/about/grain.tsx app/globals.css
git commit -m "feat(about): film grain overlay with reduced-motion opt-out"
```

---

### Task 5: WebGL sky (shader plane + particles)

**Files:**
- Create: `components/about/sky-scene.tsx`
- Create: `components/about/sky-experience.tsx`

**Interfaces:**
- Consumes: `sampleSky`, `NIGHT_KEYFRAMES`, `DAY_KEYFRAMES`, `SkyStop` from `@/components/about/sky-palette` (Task 2).
- Produces: `default export SkyExperience({ theme }: { theme: "dark" | "light" }): ReactElement`
  - Reads scroll internally each frame: `window.scrollY / max(1, docHeight - innerHeight)`.
  - No props update per scroll — page mounts it once per theme value.

- [ ] **Step 1: Create `components/about/sky-scene.tsx`**

```tsx
"use client";

import { useMemo, useRef, type ReactElement } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import {
  DAY_KEYFRAMES,
  NIGHT_KEYFRAMES,
  sampleSky,
} from "@/components/about/sky-palette";

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.9999, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec3 uTop;
uniform vec3 uMid;
uniform vec3 uBottom;
uniform vec3 uSun;
uniform float uSunY;
uniform float uSunI;
uniform float uAspect;

void main() {
  vec3 col = mix(uBottom, uMid, smoothstep(0.0, 0.55, vUv.y));
  col = mix(col, uTop, smoothstep(0.45, 1.0, vUv.y));

  vec2 p = vec2(vUv.x * uAspect, vUv.y);
  vec2 sunPos = vec2(0.5 * uAspect, uSunY);
  float d = distance(p, sunPos);
  col += uSun * uSunI * 0.55 * exp(-d * d * 18.0);   // wide glow
  col += uSun * uSunI * exp(-d * d * 900.0);          // disc

  // subtle vignette
  float vig = smoothstep(1.25, 0.35, distance(vUv, vec2(0.5)));
  col *= mix(0.82, 1.0, vig);

  gl_FragColor = vec4(col, 1.0);
}
`;

function scrollProgress(): number {
  const max = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  return Math.min(1, Math.max(0, window.scrollY / max));
}

function makePoints(
  count: number,
  spread: [number, number, number],
  center: [number, number, number],
): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    arr[i * 3] = center[0] + (Math.random() - 0.5) * spread[0];
    arr[i * 3 + 1] = center[1] + (Math.random() - 0.5) * spread[1];
    arr[i * 3 + 2] = center[2] + (Math.random() - 0.5) * spread[2];
  }
  return arr;
}

export interface SkySceneProps {
  theme: "dark" | "light";
  isMobile: boolean;
}

/** Fullscreen sky shader + stars, city bokeh, dust. Scroll drives everything. */
export function SkyScene({ theme, isMobile }: SkySceneProps): ReactElement {
  const frames = theme === "dark" ? NIGHT_KEYFRAMES : DAY_KEYFRAMES;
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color(0, 0, 0) },
      uMid: { value: new THREE.Color(0, 0, 0) },
      uBottom: { value: new THREE.Color(0, 0, 0) },
      uSun: { value: new THREE.Color(1, 1, 1) },
      uSunY: { value: 0.2 },
      uSunI: { value: 0.5 },
      uAspect: { value: 1.6 },
    }),
    [],
  );

  const starMat = useRef<THREE.PointsMaterial>(null);
  const bokehMat = useRef<THREE.PointsMaterial>(null);
  const dustRef = useRef<THREE.Points>(null);
  const smooth = useRef(0);

  const starPos = useMemo(
    () => makePoints(isMobile ? 180 : 420, [40, 18, 6], [0, 8, -30]),
    [isMobile],
  );
  const bokehPos = useMemo(
    () => makePoints(isMobile ? 30 : 70, [44, 3, 8], [0, -5.5, -28]),
    [isMobile],
  );
  const dustPos = useMemo(
    () => makePoints(isMobile ? 40 : 90, [16, 10, 8], [0, 0, -6]),
    [isMobile],
  );

  useFrame((state, delta) => {
    const target = scrollProgress();
    smooth.current = THREE.MathUtils.damp(smooth.current, target, 3.5, delta);
    const s = sampleSky(frames, smooth.current);

    uniforms.uTop.value.setRGB(...s.top);
    uniforms.uMid.value.setRGB(...s.mid);
    uniforms.uBottom.value.setRGB(...s.bottom);
    uniforms.uSun.value.setRGB(...s.sun);
    uniforms.uSunY.value = s.sunY;
    uniforms.uSunI.value = s.sunI;
    uniforms.uAspect.value = viewport.aspect;

    if (starMat.current) starMat.current.opacity = s.stars * 0.9;
    if (bokehMat.current) bokehMat.current.opacity = s.bokeh * 0.55;
    if (dustRef.current) {
      dustRef.current.rotation.y = state.clock.elapsedTime * 0.008;
      dustRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.3;
    }
  });

  return (
    <>
      <mesh frustumCulled={false} renderOrder={-1}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={uniforms}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPos, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={starMat}
          size={0.09}
          sizeAttenuation
          transparent
          opacity={0}
          color="#dbe7ff"
          depthWrite={false}
        />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[bokehPos, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={bokehMat}
          size={0.8}
          sizeAttenuation
          transparent
          opacity={0}
          color="#ffb96b"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPos, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          sizeAttenuation
          transparent
          opacity={0.35}
          color="#f5e9d5"
          depthWrite={false}
        />
      </points>
    </>
  );
}
```

- [ ] **Step 2: Create `components/about/sky-experience.tsx`**

```tsx
"use client";

import { type ReactElement } from "react";
import { Canvas } from "@react-three/fiber";

import { SkyScene } from "./sky-scene";

export interface SkyExperienceProps {
  theme: "dark" | "light";
}

/** Fixed full-viewport cinematic sky behind the story scenes. */
export default function SkyExperience({
  theme,
}: SkyExperienceProps): ReactElement {
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches;

  return (
    <div aria-hidden="true" className="fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 10], fov: 50, near: 0.1, far: 120 }}
        gl={{ antialias: !isMobile, alpha: false, powerPreference: "high-performance" }}
      >
        <SkyScene theme={theme} isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 3: Type-check**

Run: `pnpm exec tsc --noEmit 2>&1 | grep -v "app/about/page.tsx"`
Expected: no lines for `sky-scene.tsx` / `sky-experience.tsx`. (R3F v9 `bufferAttribute` requires the `args={[array, itemSize]}` form used above.)

- [ ] **Step 4: Commit**

```bash
git add components/about/sky-scene.tsx components/about/sky-experience.tsx
git commit -m "feat(about): scroll-scrubbed WebGL sky with stars, bokeh and dust"
```

---

### Task 6: Page rewrite + font + fallback + delete holo files

**Files:**
- Rewrite: `app/about/page.tsx`
- Modify: `app/about/layout.tsx` (add Cormorant Garamond font variable wrapper)
- Delete: `components/about/holo-experience.tsx`, `components/about/holo-scene.tsx`

**Interfaces:**
- Consumes: `SCENES`, `CARD_COLOR`, `LINKS`, `clockAt`, `Scene` (Task 1); `cssBackdrop`, `NIGHT_KEYFRAMES`, `DAY_KEYFRAMES` (Task 2); `CinematicLoader` (Task 3); `FilmGrain` (Task 4); `SkyExperience` (Task 5).

- [ ] **Step 1: Add font to `app/about/layout.tsx`**

Add import at top and wrap children. Only these two edits — metadata and StructuredData stay byte-identical:

```tsx
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cinema",
});
```

and change the return to:

```tsx
  return (
    <div className={cormorant.variable}>
      <StructuredData />
      {children}
    </div>
  );
```

Add a `font-cinema` helper to `app/globals.css`:

```css
.font-cinema {
  font-family: var(--font-cinema), Georgia, serif;
}
```

- [ ] **Step 2: Rewrite `app/about/page.tsx`**

Full replacement:

```tsx
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowLeft, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";

import { playClickSound } from "@/utils/sound";
import {
  SCENES,
  CARD_COLOR,
  LINKS,
  clockAt,
  type Scene,
} from "@/components/about/content";
import {
  cssBackdrop,
  DAY_KEYFRAMES,
  NIGHT_KEYFRAMES,
} from "@/components/about/sky-palette";
import CinematicLoader from "@/components/about/loader";
import FilmGrain from "@/components/about/grain";

const SkyExperience = dynamic(
  () => import("@/components/about/sky-experience"),
  { ssr: false },
);

function supportsWebgl(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

const SLUG =
  "font-mono text-[10px] uppercase tracking-[0.34em] text-amber-600/90 dark:text-amber-300/80";
const H2 =
  "font-cinema mt-3 text-4xl font-medium tracking-tight text-slate-900 dark:text-amber-50 md:text-5xl";
const BODY =
  "font-cinema text-lg leading-relaxed text-slate-700 dark:text-slate-200 md:text-xl";

/** Full-height scene panel; fades/lifts in on scroll, reports when active. */
function ScenePanel({
  index,
  onActive,
  align,
  children,
}: {
  index: number;
  onActive: (i: number) => void;
  align: "center" | "left";
  children: ReactElement;
}): ReactElement {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            if (e.intersectionRatio > 0.5) onActive(index);
          }
        }
      },
      { threshold: [0.15, 0.5, 0.85] },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [index, onActive]);

  return (
    <section
      ref={ref}
      className={`relative z-10 flex min-h-screen w-full flex-col justify-center px-5 py-24 md:px-10 ${
        align === "center" ? "items-center text-center" : "items-start"
      }`}
    >
      <div
        className={`w-full max-w-2xl transition-all duration-[900ms] ease-out ${
          shown ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

function SceneHeader({ scene, index }: { scene: Scene; index: number }): ReactElement {
  return (
    <p className={SLUG}>
      SCENE {String(index + 1).padStart(2, "0")} · {scene.slug} · {scene.time}
    </p>
  );
}

export default function AboutMe(): ReactElement {
  const { resolvedTheme } = useTheme();
  const theme: "dark" | "light" = resolvedTheme === "light" ? "light" : "dark";
  const frames = theme === "dark" ? NIGHT_KEYFRAMES : DAY_KEYFRAMES;

  const [sceneIndex, setSceneIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [mode, setMode] = useState<"pending" | "3d" | "static">("pending");
  const [loaderDone, setLoaderDone] = useState(false);
  const [clock, setClock] = useState("18:47");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMode(!reduce && supportsWebgl() ? "3d" : "static");
  }, []);

  // Diegetic clock follows scroll (rAF-throttled).
  useEffect(() => {
    let raf = 0;
    const onScroll = (): void => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        setClock(clockAt(window.scrollY / max));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const onActive = useCallback((i: number) => setSceneIndex(i), []);

  const wheel = SCENES[3];
  const walk = SCENES[4];

  return (
    <main
      className={`relative min-h-screen overflow-x-hidden text-slate-900 dark:text-slate-100 ${
        theme === "dark" ? "bg-[#04060f]" : "bg-[#f7efe2]"
      }`}
    >
      <CinematicLoader onDone={() => setLoaderDone(true)} />

      {/* Letterbox bars */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 top-0 z-30 h-5 bg-black transition-opacity duration-1000 md:h-9 ${
          loaderDone ? "opacity-90" : "opacity-0"
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 h-5 bg-black transition-opacity duration-1000 md:h-9 ${
          loaderDone ? "opacity-90" : "opacity-0"
        }`}
      />

      {mode === "3d" && <SkyExperience theme={theme} />}
      {mode === "static" && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 transition-[background] duration-1000"
          style={{ background: cssBackdrop(frames, sceneIndex / (SCENES.length - 1)) }}
        />
      )}

      <FilmGrain />

      {/* Readability wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-black/25 via-transparent to-black/35 dark:from-black/40 dark:to-black/50"
      />

      {/* Back link */}
      <div className="relative z-20 mx-auto w-full max-w-6xl px-5 pt-12 md:px-10">
        <Link
          href="/dashboard"
          onClick={() => playClickSound()}
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-amber-700/90 transition-colors hover:text-amber-600 dark:text-amber-200/80 dark:hover:text-amber-100"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          cd ~/dashboard
        </Link>
      </div>

      {/* Clock rail */}
      <nav
        aria-hidden="true"
        className="fixed right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="font-mono text-[10px] tracking-[0.2em] text-amber-700/70 dark:text-amber-200/60">
          18:47
        </span>
        <div className="relative h-40 w-px bg-slate-500/30 dark:bg-amber-100/20">
          <span
            className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-amber-500 transition-[top] duration-300 dark:bg-amber-300"
            style={{ top: `${(sceneIndex / (SCENES.length - 1)) * 100}%` }}
          />
        </div>
        <span className="font-mono text-[10px] tracking-[0.2em] text-amber-700/70 dark:text-amber-200/60">
          05:58
        </span>
        <span className="mt-2 font-mono text-xs tabular-nums text-amber-800/90 dark:text-amber-100/90">
          {clock}
        </span>
      </nav>

      {/* ——— Scene 01: THE TRAIN ——— */}
      <ScenePanel index={0} onActive={onActive} align="center">
        <>
          <SceneHeader scene={SCENES[0]} index={0} />
          <h1 className="font-cinema mt-4 text-5xl font-light tracking-[0.12em] text-slate-900 dark:text-amber-50 md:text-7xl">
            {SCENES[0].title}
          </h1>
          <p className={`mx-auto mt-8 max-w-xl ${BODY} italic`}>
            {SCENES[0].paragraphs[0]}
          </p>
          <p className={`mx-auto mt-4 max-w-xl ${BODY}`}>
            {SCENES[0].paragraphs[1]}
          </p>
          <p className="mt-12 animate-pulse font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600 dark:text-slate-400">
            scroll — the night is long ↓
          </p>
        </>
      </ScenePanel>

      {/* ——— Scenes 02 + 03: STREETS, BOOTH ——— */}
      {[SCENES[1], SCENES[2]].map((scene, i) => (
        <ScenePanel key={scene.id} index={i + 1} onActive={onActive} align="left">
          <>
            <SceneHeader scene={scene} index={i + 1} />
            <h2 className={H2}>{scene.title}</h2>
            {scene.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className={`mt-6 ${BODY}`}>
                {p}
              </p>
            ))}
          </>
        </ScenePanel>
      ))}

      {/* ——— Scene 04: FERRIS WHEEL / DISCIPLINES ——— */}
      <ScenePanel index={3} onActive={onActive} align="left">
        <>
          <SceneHeader scene={wheel} index={3} />
          <h2 className={H2}>{wheel.title}</h2>
          <p className={`mt-4 ${BODY}`}>{wheel.paragraphs[0]}</p>
          <div className="mt-8 space-y-4">
            {wheel.cards?.map((card, i) => (
              <button
                key={card.id}
                type="button"
                onMouseEnter={() => setCardIndex(i)}
                onFocus={() => setCardIndex(i)}
                onClick={() => setCardIndex(i)}
                className={`block w-full rounded-sm border p-5 text-left backdrop-blur-sm transition-all duration-500 ${
                  i === cardIndex
                    ? "border-amber-400/60 bg-white/50 dark:bg-white/[0.05]"
                    : "border-slate-400/20 opacity-60 dark:border-slate-500/20"
                }`}
                style={
                  i === cardIndex
                    ? { boxShadow: `0 0 30px ${CARD_COLOR[card.id]}22` }
                    : undefined
                }
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber-600/90 dark:text-amber-300/80">
                    DISTRICT {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: CARD_COLOR[card.id] }}
                  />
                </div>
                <h3 className="font-cinema mt-2 text-2xl font-medium text-slate-900 dark:text-amber-50">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {card.body}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {card.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-sm border border-slate-400/25 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:border-slate-500/25 dark:text-slate-400"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </>
      </ScenePanel>

      {/* ——— Scene 05: THE LONG WALK ——— */}
      <ScenePanel index={4} onActive={onActive} align="center">
        <>
          <SceneHeader scene={walk} index={4} />
          <h2 className={H2}>{walk.title}</h2>
          <p className={`mx-auto mt-4 max-w-xl ${BODY}`}>{walk.paragraphs[0]}</p>

          <ol className="mx-auto mt-10 max-w-xl space-y-6 text-left">
            {walk.beats?.map((beat, i) => (
              <li key={beat.label} className="flex gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-amber-400/50 font-mono text-xs text-amber-600 dark:text-amber-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-mono text-sm uppercase tracking-[0.2em] text-slate-900 dark:text-amber-50">
                    {beat.label}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
                    {beat.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-16 space-y-12">
            {walk.quotes?.map((line) => (
              <figure key={line.note}>
                <blockquote className="font-cinema text-2xl font-light italic leading-relaxed text-slate-800 [text-shadow:0_1px_8px_rgba(0,0,0,0.25)] dark:text-amber-50 md:text-3xl">
                  &ldquo;{line.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-amber-600/90 dark:text-amber-400/90">
                  {line.note}
                </figcaption>
              </figure>
            ))}
          </div>
        </>
      </ScenePanel>

      {/* ——— Scene 06: SUNRISE / CONTACT ——— */}
      <ScenePanel index={5} onActive={onActive} align="center">
        <>
          <SceneHeader scene={SCENES[5]} index={5} />
          <h2 className={`${H2} md:text-4xl`}>{SCENES[5].title}</h2>
          {SCENES[5].paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className={`mx-auto mt-6 max-w-xl ${BODY}`}>
              {p}
            </p>
          ))}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClickSound()}
              className="inline-flex items-center gap-2 rounded-sm border border-slate-400/30 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-slate-700 transition-colors hover:border-amber-400/60 hover:text-amber-700 dark:border-slate-500/30 dark:text-slate-200 dark:hover:text-amber-200"
            >
              <Github size={15} /> GitHub
            </a>
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClickSound()}
              className="inline-flex items-center gap-2 rounded-sm border border-slate-400/30 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-slate-700 transition-colors hover:border-amber-400/60 hover:text-amber-700 dark:border-slate-500/30 dark:text-slate-200 dark:hover:text-amber-200"
            >
              <Linkedin size={15} /> LinkedIn
            </a>
            <Link
              href={LINKS.contact}
              onClick={() => playClickSound()}
              className="inline-flex items-center gap-2 rounded-sm border border-amber-400/70 bg-amber-400/15 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-amber-800 transition-colors hover:bg-amber-400/25 dark:text-amber-200"
            >
              <Mail size={15} /> Contact <ArrowUpRight size={14} />
            </Link>
          </div>
          <p className="mt-14 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            FIN · 05:58
          </p>
        </>
      </ScenePanel>

      {/* sr-only authoritative bio for entity / name SEO (preserved) */}
      <div className="sr-only">
        <h2>Easin Arafat — Application Security Engineer at Startise</h2>
        <p>
          Easin Arafat (also known as Sheikh Easin Arafat, handle n0_arafat_n0)
          is an Application Security Engineer at Startise, working on the xCloud
          hosting platform. A graduate of the Military Institute of Science and
          Technology (MIST) in Bangladesh and former President of the MIST Cyber
          Security Club, he specializes in application security, penetration
          testing, DevSecOps, and secure coding. He has responsibly disclosed 9
          CVEs through the Patchstack Vulnerability Disclosure Program and is a
          co-author of peer-reviewed research published in Array (Elsevier, Q1).
          Easin Arafat is not affiliated with other individuals of the same name,
          such as the Eötvös Loránd University PhD student or the University of
          Dhaka Islamic-finance researcher.
        </p>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Delete replaced files**

```bash
rm components/about/holo-experience.tsx components/about/holo-scene.tsx
grep -rn "holo-experience\|holo-scene\|HoloScene\|HoloExperience" app components --include="*.ts*"
```

Expected: grep returns nothing.

- [ ] **Step 4: Type-check + unit tests**

Run: `pnpm exec tsc --noEmit`
Expected: zero errors project-wide.

Run: `pnpm exec vitest run`
Expected: all tests pass (existing `blog.test.ts` + the two new files).

- [ ] **Step 5: Commit**

```bash
git add app/about/page.tsx app/about/layout.tsx app/globals.css
git add -u components/about/
git commit -m "feat(about): cinematic Before Sunrise night-walk page replaces holo blueprint"
```

---

### Task 7: Full verification (build + E2E)

**Files:** none created — verification only.

- [ ] **Step 1: Production build**

Run: `pnpm build`
Expected: exit 0, `/about` in route list.

- [ ] **Step 2: Start dev server (background) and E2E with playwright-cli**

```bash
pnpm dev &   # via run_in_background Bash, note the port
PW_SESSION="${PILOT_SESSION_ID:-default}"
playwright-cli -s="$PW_SESSION" open http://localhost:3000/about
playwright-cli -s="$PW_SESSION" snapshot
```

Verify in snapshots/evals:
1. Loader visible on first open (title "EASIN ARAFAT", counter). Wait ~3.5s (`playwright-cli run-code` with `page.waitForTimeout(3500)`), snapshot again → loader gone, Scene 01 visible.
2. All six slug lines present:
   `playwright-cli -s="$PW_SESSION" eval "Array.from(document.querySelectorAll('p')).filter(p=>/SCENE 0[1-6]/.test(p.textContent)).length"` → `6`.
3. Scroll to bottom: `playwright-cli -s="$PW_SESSION" eval "window.scrollTo(0, document.body.scrollHeight)"` then snapshot → contact links + "FIN · 05:58" visible; clock rail shows a time after midnight.
4. Reload same session → loader skipped (sessionStorage) — content visible immediately.
5. Theme: `playwright-cli -s="$PW_SESSION" eval "document.documentElement.className"` contains `dark` by default; toggle via nav (or `eval "document.documentElement.classList.replace('dark','light')"`) → page background switches to warm light palette.
6. Console clean: `playwright-cli -s="$PW_SESSION" console` → no errors (R3F warnings about missing WebGL in headless are acceptable ONLY if the static fallback rendered; prefer `open --headed` or chromium with GL enabled).
7. Reduced motion: `playwright-cli -s="$PW_SESSION" run-code "async page => { await page.emulateMedia({ reducedMotion: 'reduce' }); await page.reload(); }"` → static gradient backdrop (no canvas element), grain not animating.
8. Close: `playwright-cli -s="$PW_SESSION" close`.

- [ ] **Step 3: Fix anything found, re-run failing check**

Any failure → systematic-debugging skill, fix, re-verify. Zero tolerance.

- [ ] **Step 4: Final commit (if fixes were made)**

```bash
git add -A && git commit -m "fix(about): E2E verification fixes"
```
