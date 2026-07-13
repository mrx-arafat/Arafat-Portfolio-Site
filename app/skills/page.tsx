"use client";

import { useCallback, useEffect, useState, type ReactElement } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";

import { useMusicContext } from "@/components/music-provider";
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

/** Dark placeholder shown while the 3D chunk loads or capability is unknown. */
function HeroPlaceholder(): ReactElement {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center rounded-2xl border border-white/10 bg-[#060913]">
      <p className="text-xs uppercase tracking-[0.35em] text-[#eef1f5]/65 motion-safe:animate-pulse">
        initializing universe…
      </p>
    </div>
  );
}

const GalaxyHero = dynamic(() => import("@/components/skills/galaxy-hero"), {
  ssr: false,
  loading: () => <HeroPlaceholder />,
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

/** Runtime WebGL capability check (WebGL2 with WebGL1 fallback). */
function supportsWebgl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}

type HeroMode = "pending" | "3d" | "static";

export default function SkillsPage(): ReactElement {
  const { isMuted, toggleMute } = useMusicContext();
  const [heroMode, setHeroMode] = useState<HeroMode>("pending");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  // Capability gate: 3D hero only with WebGL AND no reduced-motion preference.
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = (): void => {
      const prefersReduced = media.matches;
      setReducedMotion(prefersReduced);
      setHeroMode(!prefersReduced && supportsWebgl() ? "3d" : "static");
    };
    decide();
    media.addEventListener("change", decide);
    return () => media.removeEventListener("change", decide);
  }, []);

  const scrollToCategory = useCallback(
    (categoryId: string): void => {
      const target = document.getElementById(categorySectionId(categoryId));
      target?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    },
    [reducedMotion]
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
        onClick={toggleMute}
        className="absolute right-4 top-4 z-50 text-terminal-green/50 transition-colors hover:text-terminal-green"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      <Link
        href="/dashboard"
        className="mb-8 inline-flex items-center text-terminal-green hover:text-terminal-green/80"
        onClick={() => playClickSound()}
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Dashboard
      </Link>

      {/* Screen-reader navigation mirroring the planets (works with canvas hidden) */}
      <nav aria-label="Skill categories" className="sr-only">
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              <a href={`#${categorySectionId(category.id)}`}>
                {category.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <header className="mb-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-terminal-green/70">
            Mission log · 42 modules
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-4xl">
            Skill Universe
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Nine planets, one orbit — drag to explore, click a planet to land
            on its story.
          </p>
        </header>

        {/* Galaxy hero: 3D when capable, static starfield otherwise — always a dark space window */}
        <div className="mb-16 overflow-hidden rounded-2xl border border-neutral-900/10 bg-[#050810] dark:border-white/10">
          {heroMode === "3d" ? (
            <GalaxyHero
              categories={categories}
              skillCounts={skillCounts}
              onPlanetSelect={handlePlanetSelect}
            />
          ) : heroMode === "static" ? (
            <GalaxyFallback categories={categories} />
          ) : (
            <HeroPlaceholder />
          )}
        </div>

        <p className="mx-auto mb-12 max-w-2xl text-center text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
          Every planet up there is a part of how I work — here is what each one
          actually means.
        </p>

        {/* Story sections */}
        <div className="flex flex-col gap-16 md:gap-24">
          {categories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              skills={skillsByCategory[category.id] ?? []}
            />
          ))}
        </div>
      </div>

      {/* Side nav dots (desktop only) */}
      <nav
        aria-label="Category quick navigation"
        className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex"
      >
        {categories.map((category) => {
          const isActive =
            activeSectionId === categorySectionId(category.id);
          return (
            <button
              key={category.id}
              type="button"
              aria-label={category.label}
              aria-current={isActive ? "true" : undefined}
              onClick={() => {
                playClickSound();
                scrollToCategory(category.id);
              }}
              className={`rounded-full outline-none focus-visible:ring-2 focus-visible:ring-terminal-green motion-safe:transition-all motion-safe:duration-200 ${
                isActive
                  ? "h-4 w-4"
                  : "h-2.5 w-2.5 opacity-60 hover:opacity-100"
              }`}
              style={{
                backgroundColor: category.color,
                boxShadow: isActive ? `0 0 10px ${category.color}` : undefined,
              }}
            />
          );
        })}
      </nav>

      {/* Footer */}
      <div className="relative z-10 mx-auto mt-16 w-full max-w-7xl px-4 text-center text-xs tracking-widest text-neutral-500 dark:text-neutral-600">
        <div className="border-t border-neutral-900/10 pt-4 dark:border-white/[0.06]">
          ARAFAT © {new Date().getFullYear()} - ALL RIGHTS RESERVED
        </div>
      </div>
    </main>
  );
}
