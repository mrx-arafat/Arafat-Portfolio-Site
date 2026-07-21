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
  SECTIONS,
  CARD_COLOR,
  LINKS,
  type Section,
} from "@/components/about/content";
import {
  cssBackdrop,
  DAY_KEYFRAMES,
  NIGHT_KEYFRAMES,
} from "@/components/about/sky-palette";

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

const LABEL =
  "font-mono text-[10px] uppercase tracking-[0.34em] text-terminal-green";
const H2 =
  "mt-3 text-4xl font-medium tracking-tight text-slate-900 dark:text-terminal-green md:text-5xl";
const BODY =
  "text-lg leading-relaxed text-slate-700 dark:text-slate-200 md:text-xl";

/** Full-height section panel; fades/lifts in on scroll, reports when active. */
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
            // Ratio caps at viewportH/panelH, so tall panels can never hit a
            // fixed ratio — track "panel contains viewport center" instead.
            const r = e.boundingClientRect;
            if (r.top < window.innerHeight / 2 && r.bottom > window.innerHeight / 2)
              onActive(index);
          }
        }
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] },
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
        className={`w-full max-w-2xl rounded-lg bg-[#dfe6ee]/50 p-6 backdrop-blur-[3px] transition-all duration-[900ms] ease-out dark:bg-surface-deep/50 md:p-8 ${
          shown ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

export default function AboutMe(): ReactElement {
  const { resolvedTheme } = useTheme();
  // `mounted` forces a post-hydration re-render: React production hydration
  // keeps mismatched server attributes, so theme-dependent classNames only
  // correct themselves on a committed re-render (same pattern as site-nav).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const theme: "dark" | "light" =
    mounted && resolvedTheme === "light" ? "light" : "dark";
  const frames = theme === "dark" ? NIGHT_KEYFRAMES : DAY_KEYFRAMES;

  const [sectionIndex, setSectionIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [mode, setMode] = useState<"pending" | "3d" | "static">("pending");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMode(!reduce && supportsWebgl() ? "3d" : "static");
  }, []);

  const onActive = useCallback((i: number) => setSectionIndex(i), []);

  const skills = SECTIONS[3];
  const approach = SECTIONS[4];

  return (
    <main
      className={`relative min-h-screen overflow-x-hidden text-slate-900 dark:text-slate-100 ${
        theme === "dark" ? "bg-surface-deep" : "bg-[#dfe6ee]"
      }`}
    >
      {mode === "3d" && <SkyExperience theme={theme} />}
      {mode === "static" && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 transition-[background] duration-1000"
          style={{
            background: cssBackdrop(frames, sectionIndex / (SECTIONS.length - 1)),
          }}
        />
      )}

      {/* Readability wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-white/30 via-transparent to-white/40 dark:from-black/40 dark:to-black/50"
      />

      {/* Back link */}
      <div className="relative z-20 mx-auto w-full max-w-6xl px-5 pt-12 md:px-10">
        <Link
          href="/"
          onClick={() => playClickSound()}
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-terminal-green/80 transition-colors hover:text-terminal-green"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          cd ~
        </Link>
      </div>

      {/* Progress dot rail */}
      <div
        aria-hidden="true"
        className="fixed right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex"
      >
        {SECTIONS.map((section, i) => (
          <span
            key={section.id}
            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
              i === sectionIndex
                ? "scale-150 bg-terminal-green"
                : "bg-slate-500/40"
            }`}
          />
        ))}
      </div>

      {/* ——— Section 01: WHO I AM ——— */}
      <ScenePanel index={0} onActive={onActive} align="center">
        <>
          <p className={LABEL}>{SECTIONS[0].label}</p>
          <h1 className="mt-4 text-5xl font-medium tracking-tight text-slate-900 dark:text-terminal-green md:text-6xl">
            {SECTIONS[0].title}
          </h1>
          {SECTIONS[0].paragraphs.map((p, pi) => (
            <p key={pi} className={`mx-auto mt-6 max-w-xl ${BODY}`}>
              {p}
            </p>
          ))}
          <p className="mt-12 animate-pulse font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600 dark:text-slate-400">
            scroll ↓
          </p>
        </>
      </ScenePanel>

      {/* ——— Sections 02 + 03: BACKGROUND, SECURITY ——— */}
      {[SECTIONS[1], SECTIONS[2]].map((section: Section, i) => (
        <ScenePanel key={section.id} index={i + 1} onActive={onActive} align="left">
          <>
            <p className={LABEL}>{section.label}</p>
            <h2 className={H2}>{section.title}</h2>
            {section.paragraphs.map((p, pi) => (
              <p key={pi} className={`mt-6 ${BODY}`}>
                {p}
              </p>
            ))}
          </>
        </ScenePanel>
      ))}

      {/* ——— Section 04: WHAT I DO ——— */}
      <ScenePanel index={3} onActive={onActive} align="left">
        <>
          <p className={LABEL}>{skills.label}</p>
          <h2 className={H2}>{skills.title}</h2>
          <p className={`mt-4 ${BODY}`}>{skills.paragraphs[0]}</p>
          <div className="mt-8 space-y-4">
            {skills.cards?.map((card, i) => (
              <button
                key={card.id}
                type="button"
                onMouseEnter={() => setCardIndex(i)}
                onFocus={() => setCardIndex(i)}
                onClick={() => setCardIndex(i)}
                className={`block w-full rounded-sm border p-5 text-left backdrop-blur-sm transition-all duration-500 ${
                  i === cardIndex
                    ? "border-terminal-green/60 bg-white/50 dark:bg-white/[0.05]"
                    : "border-slate-400/20 opacity-60 dark:border-slate-500/20"
                }`}
                style={
                  i === cardIndex
                    ? { boxShadow: `0 0 30px ${CARD_COLOR[card.id]}22` }
                    : undefined
                }
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-terminal-green/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: CARD_COLOR[card.id] }}
                  />
                </div>
                <p className="mt-2 text-2xl font-medium text-slate-900 dark:text-terminal-green">
                  {card.title}
                </p>
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

      {/* ——— Section 05: HOW I WORK ——— */}
      <ScenePanel index={4} onActive={onActive} align="center">
        <>
          <p className={LABEL}>{approach.label}</p>
          <h2 className={H2}>{approach.title}</h2>
          <p className={`mx-auto mt-4 max-w-xl ${BODY}`}>
            {approach.paragraphs[0]}
          </p>

          <ol className="mx-auto mt-10 max-w-xl space-y-6 text-left">
            {approach.beats?.map((beat, i) => (
              <li key={beat.label} className="flex gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-terminal-green/50 font-mono text-xs text-terminal-green">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-mono text-sm uppercase tracking-[0.2em] text-slate-900 dark:text-terminal-green">
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
            {approach.quotes?.map((line) => (
              <figure key={line.note}>
                <blockquote className="text-2xl font-light italic leading-relaxed text-slate-800 [text-shadow:0_1px_8px_rgba(0,0,0,0.25)] dark:text-terminal-green md:text-3xl">
                  &ldquo;{line.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-terminal-green/90">
                  {line.note}
                </figcaption>
              </figure>
            ))}
          </div>
        </>
      </ScenePanel>

      {/* ——— Section 06: CONTACT ——— */}
      <ScenePanel index={5} onActive={onActive} align="center">
        <>
          <p className={LABEL}>{SECTIONS[5].label}</p>
          <h2 className={`${H2} md:text-4xl`}>{SECTIONS[5].title}</h2>
          {SECTIONS[5].paragraphs.map((p, pi) => (
            <p key={pi} className={`mx-auto mt-6 max-w-xl ${BODY}`}>
              {p}
            </p>
          ))}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClickSound()}
              className="inline-flex items-center gap-2 rounded-sm border border-slate-400/30 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-slate-700 transition-colors hover:border-terminal-green/60 hover:text-terminal-green dark:border-slate-500/30 dark:text-slate-200 dark:hover:text-terminal-green"
            >
              <Github size={15} /> GitHub
            </a>
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClickSound()}
              className="inline-flex items-center gap-2 rounded-sm border border-slate-400/30 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-slate-700 transition-colors hover:border-terminal-green/60 hover:text-terminal-green dark:border-slate-500/30 dark:text-slate-200 dark:hover:text-terminal-green"
            >
              <Linkedin size={15} /> LinkedIn
            </a>
            <Link
              href={LINKS.contact}
              onClick={() => playClickSound()}
              className="inline-flex items-center gap-2 rounded-sm border border-terminal-green/70 bg-terminal-green/15 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-terminal-green transition-colors hover:bg-terminal-green/25"
            >
              <Mail size={15} /> Contact <ArrowUpRight size={14} />
            </Link>
          </div>
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
