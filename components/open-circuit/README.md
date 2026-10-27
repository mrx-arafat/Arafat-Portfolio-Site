# Open Circuit foundation

Import shared components from `@/components/open-circuit`.
The presentation primitives are server components.
`DecryptPhoto`, `MotionProvider`, `MotionToggle` and `useMotion` are client entry points.
Keep page data fetching, metadata and JSON-LD on the server.
The foundation worker owns this directory, the global CSS and the site shell.

## Page layout

Use one existing semantic `main` per route, with `oc-shell oc-page` for the shared width, dotted ground and page spacing.
The root layout already provides the skip target `#main-content`, navigation, footer, music provider and motion provider.
Do not add another provider or another `main-content` ID.

```tsx
import { PageHeader, CircuitTrace, SectionHeading } from "@/components/open-circuit";

<main className="oc-shell oc-page">
  <PageHeader command="$ cat about.txt" title="I have range. Here is the evidence." />
  <CircuitTrace>
    <section className="oc-zone" aria-labelledby="record-title">
      <SectionHeading path="about" id="record-title" title="My record" note="I keep receipts" />
      {/* Existing page content and data. */}
    </section>
  </CircuitTrace>
</main>
```

## PageHeader

Props: `title: ReactNode`, optional `description: ReactNode`, `command: string`, `note: string`, `children: ReactNode`, `id: string` (default `page-title`) and `className: string`.
Renders the page's h1; do not put another h1 in the route.
The description is a block container, so a paragraph or inline content is accepted.

```tsx
<PageHeader command="$ man arafat" title="Frequently asked questions." description="Answers, without the guesswork." />
```

## SectionHeading

Props: required `path: string`, optional `note: string`, `title: ReactNode`, `id: string`, `className: string` and `level: 2 | 3` (default `2`).
`path="proof"` renders `$ ls ~/proof`.
When `title` is omitted, only the command line is rendered.
When a title is supplied, `id` belongs to that heading.

```tsx
<SectionHeading path="proof" note="leave a trace" title="The paper trail." id="proof-title" />
```

## Keycap

Props: required `children: ReactNode`, optional `command: string`, `variant: "default" | "primary"`, `className: string` and `aria-label: string`.
Supply `href: string` to render a Next.js Link.
Without `href`, it renders a button accepting `onClick: () => void`, `type: "button" | "submit" | "reset"` (default `button`) and `disabled: boolean`.
Do not pass `onClick` to the link variant or put interactive children inside either variant.
Keep an explicit accessible name consistent with visible text if supplied.

```tsx
<Keycap href="/contact" command="$ ./connect.sh --secure" variant="primary">CONTACT ME</Keycap>
<Keycap type="submit" command="$ ./send.sh">Send message</Keycap>
```

## Chip

Props: required `children: ReactNode`, optional `tone: "green" | "amber" | "muted"` (default `green`) and `className: string`.
This is noninteractive metadata, not a link or button.

```tsx
<Chip tone="amber">Peer reviewed</Chip>
```

## StatusTag

Props: optional `children: ReactNode`, `tone: "ok" | "warn" | "neutral"` (default `ok`) and `className: string`.
The default words are `[ OK ]`, `[ WARN ]` and `[ INFO ]`.
Custom children replace the word inside the brackets.

```tsx
<StatusTag tone="warn">RESPONSIBLY DISCLOSED</StatusTag>
```

## CircuitTrace

Props: required `children: ReactNode`, optional `className: string`.
Adds the single vertical circuit trace and responsive inset.
Put `oc-zone` sections containing `SectionHeading` inside it to align the circuit nodes.

```tsx
<CircuitTrace><section className="oc-zone"><SectionHeading path="work" title="Build logs." /></section></CircuitTrace>
```

## DecryptPhoto

Client component.
Props: optional `src: string` (default `/images/easin-arafat.webp`), `alt: string`, `caption: string`, `className: string` and `priority: boolean` (default `false`).
Uses the existing profile photo with Next Image, decorative binary rain and scan lines. A "Reveal the operator" toggle removes the terminal treatment, and "Restore terminal view" brings it back.
Supply `priority` only for an above-the-fold portrait.
The motion policy stops its effects; the identity overlay stays legible in both themes.

```tsx
<DecryptPhoto priority />
```

## Card

Props: required `children: ReactNode`, optional `title: ReactNode`, `href: string`, `id: string`, `className: string` and `headingLevel: 2 | 3 | 4` (default `3`).
Renders an article with a full border.
When `href` is supplied, also supply `title`: only the title becomes an anchor, with a stretched hit area covering the card.
Other links and buttons in the body stay above that hit area.
Do not wrap Card in a link or put a link inside its title.

```tsx
<Card title="TermStream" href="/projects/client-work/termstream"><p>{project.summary}</p></Card>
```

## Prose

Props: required `children: ReactNode`, optional `className: string`.
Provides 72ch reading width, 18px text, 1.75 line height, headings, lists, visible text links, code blocks and bordered tables.
Render real table headers and wrap unusually wide tables if page-specific content requires it.

```tsx
<Prose><p>Existing long-form content.</p></Prose>
```

## MotionProvider, MotionToggle and useMotion

`MotionProvider` accepts `children` and is already installed in `app/layout.tsx`.
`MotionToggle` has no props and is already in the navigation; it may also appear inside a modal.
Below the desktop breakpoint, the header shows only its icon while retaining its full accessible name and 44px target.
The navigation also keeps a `mode: superintelligence` chip visible beside the site identity.
`useMotion()` returns `{ motion: "on" | "off" | "reduced", isMotionEnabled: boolean, toggleMotion: () => void }`.
The preference is stored in localStorage under `open-circuit-motion` and mirrored to `html[data-motion="on"|"off"]`.
Operating-system reduced motion always wins and disables the toggle with a visible `Motion: reduced` label.
CSS animation and transitions are stopped globally when motion is off or reduced.
For JavaScript animation or canvas work, also use `isMotionEnabled` to stop animation loops.

The home intro replays six terminal panes using the single deterministic clock in `app/components/fleet-timeline.ts`.
Its scrolling histories, sample filenames, diff counters and check counters illustrate the workflow rather than reporting live execution.
The build pauses while review advances through three checks, then the branches converge, a pulse travels along main and the borders flash once.
The merge caption has a separate row below the clipped graph.
The replay takes 4.2 seconds, followed by a 300ms fold when the visitor engages.
The grid uses bounded viewport sizing and clips log overflow instead of exposing scrollbars.
Motion off or reduced renders the completed, merged state immediately, including a CSS-selected static replay before hydration.
Any key or tap completes the replay; Enter or the engage keycap folds pane borders into the home circuit, while Skip intro or Escape enters immediately.
The replay stays hidden from assistive technology behind a plain-text dialog description.
The replay region is named and keyboard-focusable, and the keycap has a 2px keyboard focus ring with a 3px offset.
Touch does not receive the keycap focus outline.
`HomeShell` renders the open intro before the dashboard in the server response.
The inline head script in `app/components/boot-session.ts` covers the home route while it streams and hides the intro before paint for a remembered session or the existing `?boot=1` bypass.
First-visit dismissal remains remembered per session.

```tsx
"use client";
import { MotionToggle, useMotion } from "@/components/open-circuit";
const { isMotionEnabled } = useMotion();
// Pass isMotionEnabled to an existing animation's enabled/pause control.
```

## Available CSS classes and tokens

- Layout: `oc-shell` (88rem maximum with responsive gutters), `oc-page`, `oc-zone`, `oc-flow`, `oc-section-top`, `oc-section-title`, `oc-page-header`, `oc-page-description`.
- Reading and links: `oc-prose`, `oc-route`, `oc-command`, `oc-mono`, `oc-small`, `oc-sr`.
- Solid text colours: `oc-green`, `oc-soft`, `oc-amber`, `oc-red`, `oc-muted`.
- Components: `oc-keycap` with `oc-primary`, `oc-card`, `oc-stretched`, `oc-chip`, `oc-status`, `oc-control`, `oc-icon-control`.
- Composition: `oc-keyrack`, `oc-proof-ledger`, `oc-posts`, `oc-post-link`, `oc-category-links`, `oc-social-links`.

All existing Tailwind tokens remain available.
New CSS aliases are `--oc-deep`, `--oc-raised`, `--oc-page`, `--oc-night`, `--oc-panel`, `--oc-green`, `--oc-soft`, `--oc-amber`, `--oc-red`, `--oc-ink`, `--oc-muted`, `--oc-line`, `--oc-shadow`, `--oc-key-ink`, `--oc-mono` and `--oc-sans`.
`--ring` is defined in both themes and global keyboard outlines are visible.
Programmatic focus targets with `tabindex="-1"` do not draw an outline; real controls retain the amber focus outline.
Shared type sizes are `--oc-text-small` (12px), `--oc-text-label` (13px) and `--oc-text-body` (16px).
Use the label size for commands, navigation and metadata, and the body size or larger for reading text.
The mobile header is one row from 360px, with the shortened `arafat@ops:~` prompt, three icon controls and Menu.
At narrower widths its controls occupy a second row; the expanded menu is a two-column grid with 44px links.
Light-mode terminal colours are deliberately darker to remain readable on cream and tan surfaces.
Source palette calculations put green, soft green, amber and red at 4.84:1 or higher even on the tan panel; muted text is also darkened for that surface.
Use solid tokens instead of alpha text utilities.
Keep new page styles in owned components or CSS modules; request shared changes from the foundation worker.

This README describes the implemented contract, not browser acceptance.
Build, dev-server and rendered accessibility verification belong to the boss.
