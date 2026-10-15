"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ReactElement } from "react";
import { useMotion } from "@/components/open-circuit/motion-provider";
import { SkillCard } from "@/components/skills/skill-card";
import {
  categorySectionId,
  type CategorySectionProps,
} from "@/components/skills/types";

/** Per-row stagger delay for the fade-up reveal. */
const STAGGER_MS = 70;

/** IntersectionObserver support cannot change after load, so there is nothing to listen for. */
function subscribeToNothing(): () => void {
  return () => {};
}

function canObserveIntersection(): boolean {
  return "IntersectionObserver" in window;
}

/** Mirror the pre-hydration intersection capability. */
const serverCanObserveIntersection = (): boolean => true;

/** Planet dossier for one skill category: ordinal rule, orb header, instrument-panel skill rows. */
export function CategorySection({
  category,
  skills,
}: CategorySectionProps): ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { isMotionEnabled } = useMotion();
  const canObserve = useSyncExternalStore(
    subscribeToNothing,
    canObserveIntersection,
    serverCanObserveIntersection
  );
  const [hasEnteredView, setHasEnteredView] = useState(false);
  // Rows that can never be observed scrolling into view are shown outright.
  const isRevealed = !isMotionEnabled || hasEnteredView || !canObserve;

  useEffect(() => {
    const node = sectionRef.current;
    if (!isMotionEnabled || !canObserve || !node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isMotionEnabled, canObserve]);

  const { color } = category;
  const ordinal = String(category.order).padStart(2, "0");

  return (
    <section
      id={categorySectionId(category.id)}
      tabIndex={-1}
      aria-labelledby={`${categorySectionId(category.id)}-heading`}
      ref={sectionRef}
      className="relative scroll-mt-24 px-4 py-12 md:px-8 md:py-16"
      style={{
        background: `radial-gradient(ellipse 85% 60% at 50% 0%, ${color}0c, transparent 70%)`,
      }}
    >
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-10">
          <div className="flex items-center gap-4">
            <span
              className="font-mono text-xs tracking-[0.4em] text-neutral-600 dark:text-neutral-400"
              aria-hidden="true"
            >
              {ordinal}
            </span>
            <span
              aria-hidden="true"
              className="h-px flex-1"
              style={{
                background: `linear-gradient(to right, ${color}66, transparent)`,
              }}
            />
          </div>

          <div className="mt-6 flex items-center gap-5">
            <span
              aria-hidden="true"
              className="relative h-12 w-12 shrink-0 rounded-full md:h-14 md:w-14"
              style={{
                background: `radial-gradient(circle at 32% 28%, ${color}f2, ${color}8c 45%, #060913 100%)`,
                boxShadow: `0 0 24px ${color}4d, inset -7px -7px 16px rgba(0, 0, 0, 0.55)`,
              }}
            >
              <span
                aria-hidden="true"
                className="absolute -inset-2 rounded-full border"
                style={{
                  borderColor: `${color}33`,
                  transform: "rotateX(64deg)",
                }}
              />
            </span>
            <div className="min-w-0">
              <h3 id={`${categorySectionId(category.id)}-heading`} className="break-words text-xl font-semibold uppercase tracking-[0.18em] text-neutral-900 dark:text-neutral-100 md:text-2xl">
                {category.label}
              </h3>
              <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400 md:text-[15px]">
                {category.tagline}
              </p>
            </div>
          </div>
        </header>

        <div className="divide-y divide-neutral-900/10 border-y border-neutral-900/10 dark:divide-white/[0.06] dark:border-white/[0.06]">
          {skills.map((skill, index) => (
            <div
              key={skill.id}
              className={
                !isMotionEnabled
                  ? ""
                  : `transition-[opacity,transform] duration-500 ease-out ${
                      isRevealed
                        ? "translate-y-0 opacity-100"
                        : "translate-y-5 opacity-0"
                    }`
              }
              style={
                !isMotionEnabled
                  ? undefined
                  : { transitionDelay: `${index * STAGGER_MS}ms` }
              }
            >
              <SkillCard skill={skill} color={color} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
