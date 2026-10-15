"use client";

import { useCallback, useEffect, useState, useSyncExternalStore, type ReactElement } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";

import { useMusicContext } from "@/components/music-provider";
import { useMotion } from "@/components/open-circuit/motion-provider";
import { CategorySection } from "@/components/skills/category-section";
import GalaxyFallback from "@/components/skills/galaxy-fallback";
import {
  categorySectionId,
  type CategoryMeta,
  type Skill,
} from "@/components/skills/types";
import skillsData from "@/data/skills.json";
import { playClickSound } from "@/utils/sound";

/** Shape of data/skills.json once the Skill Universe fields land. */
interface SkillsData {
  categories: CategoryMeta[];
  skills: Skill[];
}

const data = skillsData as unknown as SkillsData;
const totalSkills = data.skills.length;

const categories: CategoryMeta[] = [...(data.categories ?? [])].sort(
  (a, b) => a.order - b.order
);

const skillsByCategory: Record<string, Skill[]> = {};
for (const skill of data.skills) {
  (skillsByCategory[skill.category] ??= []).push(skill);
}

const skillCounts: Record<string, number> = Object.fromEntries(
  categories.map((category) => [
    category.id,
    skillsByCategory[category.id]?.length ?? 0,
  ])
);

const CAPABILITY_TRACKS = [
  {
    id: "secure",
    label: "Secure the boundary",
    description:
      "Research, testing, and verification that make risk visible before it becomes production impact.",
    categoryIds: ["security", "testing"],
  },
  {
    id: "operate",
    label: "Build and operate the platform",
    description:
      "Application development, infrastructure, and data systems that keep a release path understandable.",
    categoryIds: ["development", "devops", "database"],
  },
  {
    id: "automate",
    label: "Automate with control",
    description:
      "AI workflows, automation, and human coordination for repeated technical work with clear approval points.",
    categoryIds: ["ai", "automation", "business", "soft-skill"],
  },
] as const;

const GalaxyHero = dynamic(() => import("@/components/skills/galaxy-hero"), {
  ssr: false,
  loading: () => <GalaxyFallback categories={categories} />,
});

/** Deterministic PRNG so the starfield is stable across renders. */
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildStarShadows(count: number, seed: number, alpha: number): string {
  const random = mulberry32(seed);
  const shadows: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const x = Math.round(random() * 1920);
    const y = Math.round(random() * 1080);
    shadows.push(`${x}px ${y}px 0 0 rgba(255,255,255,${alpha})`);
  }
  return shadows.join(", ");
}

const STARS_DIM = buildStarShadows(110, 7, 0.22);
const STARS_BRIGHT = buildStarShadows(30, 13, 0.5);

/** Fixed viewport starfield behind the whole page. */
function PageStarfield(): ReactElement {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 hidden dark:block"
    >
      <span
        className="absolute h-px w-px rounded-full"
        style={{ boxShadow: STARS_DIM }}
      />
      <span
        className="absolute h-[2px] w-[2px] rounded-full"
        style={{ boxShadow: STARS_BRIGHT }}
      />
    </div>
  );
}

let webglSupported: boolean | undefined;

/** Cache the runtime capability check; the scene needs WebGL2 in Three.js. */
function supportsWebgl(): boolean {
  if (webglSupported !== undefined) return webglSupported;
  try {
    const context = document.createElement("canvas").getContext("webgl2");
    webglSupported = Boolean(context);
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupported = false;
  }
  return webglSupported;
}

function subscribeToCapability(): () => void { return () => {}; }
const serverSupportsWebgl = (): boolean => false;

export default function SkillsPage(): ReactElement {
  const { isMuted, toggleMute } = useMusicContext();
  const { isMotionEnabled } = useMotion();
  const hasWebgl = useSyncExternalStore(subscribeToCapability, supportsWebgl, serverSupportsWebgl);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const scrollToCategory = useCallback(
    (categoryId: string): void => {
      const target = document.getElementById(categorySectionId(categoryId));
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({
        behavior: isMotionEnabled ? "smooth" : "auto",
        block: "start",
      });
    },
    [isMotionEnabled]
  );

  const handlePlanetSelect = useCallback(
    (categoryId: string): void => {
      playClickSound();
      scrollToCategory(categoryId);
    },
    [scrollToCategory]
  );

  // Track which category section is in view for the side-nav dots.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    for (const category of categories) {
      const el = document.getElementById(categorySectionId(category.id));
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col bg-surface-base p-4 dark:bg-[#050810] md:p-8">
      <PageStarfield />
      {/* Sound toggle */}
      <button
        type="button"
        onClick={toggleMute}
        className="absolute right-4 top-4 z-50 flex h-11 w-11 items-center justify-center text-terminal-green transition-colors hover:text-terminal-green"
        aria-label={isMuted ? "Unmute sound" : "Mute sound"}
        aria-pressed={isMuted}
      >
        {isMuted ? <VolumeX size={24} aria-hidden="true" /> : <Volume2 size={24} aria-hidden="true" />}
      </button>

      <Link
        href="/"
        className="mb-8 inline-flex min-h-11 items-center self-start pr-12 text-terminal-green hover:text-terminal-green/80"
        onClick={() => playClickSound()}
      >
        <ArrowLeft size={20} className="mr-2" aria-hidden="true" />
        Back to Dashboard
      </Link>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <header className="mb-6">
          <p aria-hidden="true" className="font-mono text-[13px] uppercase tracking-[0.4em] text-terminal-green/70">
            Capability map · {totalSkills} modules
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-4xl">
            Skills, organized by the work they make possible.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Explore the universe, then scan the actual tools and practices by
            the production outcome they support.
          </p>
        </header>

        {/* Galaxy hero: 3D when capable, static starfield otherwise — always a dark space window */}
        <div className="mb-16 overflow-hidden rounded-2xl border border-neutral-900/10 bg-[#050810] dark:border-white/10">
          {hasWebgl && isMotionEnabled ? (
            <GalaxyHero
              categories={categories}
              skillCounts={skillCounts}
              onPlanetSelect={handlePlanetSelect}
            />
          ) : (
            <GalaxyFallback categories={categories} />
          )}
        </div>

        <nav
          aria-label="Orbit index"
          className="mx-auto mb-12 w-full max-w-5xl border-y border-neutral-900/10 py-5 dark:border-white/[0.06]"
        >
          <div className="flex flex-col gap-2 border-b border-neutral-900/10 pb-4 dark:border-white/[0.06] sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p aria-hidden="true" className="font-mono text-[13px] uppercase tracking-[0.24em] text-terminal-green">
                $ orbit --index
              </p>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Click a planet above or choose a domain here to land on its detail.
              </p>
            </div>
            <span className="font-mono text-[13px] uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400">
              9 domains
            </span>
          </div>
          <div className="grid sm:grid-cols-3">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                aria-label={`Explore ${category.label} skills`}
                aria-controls={categorySectionId(category.id)}
                onClick={() => {
                  playClickSound();
                  scrollToCategory(category.id);
                }}
                className="flex min-h-12 items-center gap-3 border-b border-neutral-900/10 px-3 py-3 text-left transition-colors hover:bg-white/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green dark:border-white/[0.06] sm:border-r sm:nth-[3n]:border-r-0"
              >
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {category.label}
                </span>
                <span aria-hidden="true" className="ml-auto font-mono text-[13px] text-neutral-600 dark:text-neutral-400">
                  {String(skillCounts[category.id]).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
        </nav>

        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="font-mono text-[13px] uppercase tracking-[0.24em] text-terminal-green">
            How the work connects
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
            The planets are the detail. These three tracks show how those
            capabilities connect when the work has to ship, stay safe, and be
            explainable.
          </p>
        </div>

        <div className="flex flex-col gap-20 md:gap-28">
          {CAPABILITY_TRACKS.map((track) => (
            <section key={track.id} aria-labelledby={`track-${track.id}`}>
              <header className="mx-auto mb-4 w-full max-w-5xl border-b border-neutral-900/10 pb-6 dark:border-white/[0.06]">
                <p aria-hidden="true" className="font-mono text-[13px] uppercase tracking-[0.24em] text-terminal-green">
                  $ track --{track.id}
                </p>
                <h2
                  id={`track-${track.id}`}
                  className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-3xl"
                >
                  {track.label}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {track.description}
                </p>
              </header>
              <div className="flex flex-col gap-10 md:gap-14">
                {track.categoryIds.map((categoryId) => {
                  const category = categories.find(
                    (item) => item.id === categoryId
                  );
                  if (!category) return null;

                  return (
                    <CategorySection
                      key={category.id}
                      category={category}
                      skills={skillsByCategory[category.id] ?? []}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Side nav dots (desktop only) */}
      <nav
        aria-label="Category quick navigation"
        className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center md:flex"
      >
        {categories.map((category) => {
          const isActive =
            activeSectionId === categorySectionId(category.id);
          return (
            <button
              key={category.id}
              type="button"
              aria-label={`Explore ${category.label} skills`}
              aria-controls={categorySectionId(category.id)}
              aria-current={isActive ? "true" : undefined}
              onClick={() => {
                playClickSound();
                scrollToCategory(category.id);
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-terminal-green"
            >
              <span
                aria-hidden="true"
                className={`rounded-full motion-safe:transition-all motion-safe:duration-200 ${isActive ? "h-4 w-4" : "h-2.5 w-2.5 opacity-60 hover:opacity-100"}`}
                style={{ backgroundColor: category.color, boxShadow: isActive ? `0 0 10px ${category.color}` : undefined }}
              />
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="relative z-10 mx-auto mt-16 w-full max-w-7xl px-4 text-center text-xs tracking-widest text-neutral-600 dark:text-neutral-400">
        <div className="border-t border-neutral-900/10 pt-4 dark:border-white/[0.06]">
          ARAFAT © {new Date().getFullYear()} - ALL RIGHTS RESERVED
        </div>
      </div>
    </main>
  );
}
