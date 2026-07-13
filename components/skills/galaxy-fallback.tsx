import type { ReactElement } from "react";

import { categorySectionId, type CategoryMeta } from "@/components/skills/types";

/**
 * Static, motion-free stand-in for the 3D galaxy hero. Rendered when WebGL is
 * unavailable or the visitor prefers reduced motion: a CSS starfield with one
 * glowing "planet chip" per category that anchors to its story section.
 */
interface GalaxyFallbackProps {
  categories: CategoryMeta[];
}

/** Deterministic PRNG so the starfield is stable across renders. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Build a multi-star box-shadow string scattered across the hero area. */
function buildStarShadows(
  count: number,
  seed: number,
  spread: number,
  alpha: number
): string {
  const rand = mulberry32(seed);
  const shadows: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const x = (rand() * 100).toFixed(2);
    const y = (rand() * 100).toFixed(2);
    shadows.push(`${x}vw ${y}vh 0 ${spread}px rgba(255, 255, 255, ${alpha})`);
  }
  return shadows.join(", ");
}

const SMALL_STARS = buildStarShadows(80, 1337, 0, 0.45);
const BRIGHT_STARS = buildStarShadows(24, 2026, 1, 0.8);

export default function GalaxyFallback({
  categories,
}: GalaxyFallbackProps): ReactElement {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-white/10"
      style={{
        background:
          "radial-gradient(ellipse 60% 45% at 30% 20%, rgba(109, 64, 200, 0.18), transparent 70%), radial-gradient(ellipse 55% 40% at 75% 75%, rgba(28, 120, 160, 0.15), transparent 70%), #060913",
      }}
    >
      {/* CSS starfield (decorative) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span
          className="absolute left-0 top-0 h-px w-px rounded-full"
          style={{ boxShadow: SMALL_STARS }}
        />
        <span
          className="absolute left-0 top-0 h-px w-px rounded-full"
          style={{ boxShadow: BRIGHT_STARS }}
        />
      </div>

      <div className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center gap-10 px-6 py-16 md:min-h-[70vh]">
        {/* Core star */}
        <div className="flex flex-col items-center gap-3">
          <span
            aria-hidden="true"
            className="block h-16 w-16 rounded-full md:h-20 md:w-20"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, #fff7d6, #f5c96b 55%, #b8801f)",
              boxShadow:
                "0 0 30px rgba(245, 201, 107, 0.55), 0 0 90px rgba(245, 201, 107, 0.25)",
            }}
          />
          <p className="text-xs uppercase tracking-[0.35em] text-[#eef1f5]/75">
            Arafat — core star
          </p>
        </div>

        {/* Planet chips */}
        <ul className="flex max-w-3xl flex-wrap items-start justify-center gap-x-6 gap-y-8">
          {categories.map((category) => (
            <li key={category.id}>
              <a
                href={`#${categorySectionId(category.id)}`}
                className="group flex w-20 flex-col items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060913]"
              >
                <span
                  aria-hidden="true"
                  className="block h-12 w-12 rounded-full motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:scale-110 md:h-14 md:w-14"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.55), ${category.color} 55%)`,
                    boxShadow: `0 0 18px ${category.color}66`,
                  }}
                />
                <span className="text-center text-xs font-medium text-[#f2f5f8]/90 group-hover:text-[#ffffff]">
                  {category.label}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="text-center text-sm text-[#eef1f5]/75">
          Pick a planet to jump to its story.
        </p>
      </div>
    </div>
  );
}
