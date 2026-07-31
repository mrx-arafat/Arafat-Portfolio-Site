"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import {
  type KeyboardEvent,
  type MouseEvent,
  type TouchEvent,
  useRef,
  useState,
} from "react";

import {
  CLIENT_WORK_CTA,
  type ClientProject,
  getAdjacentSlideIndex,
  getSwipeStep,
} from "./content";

interface ProjectWalkthroughProps {
  project: ClientProject;
}

function ProjectWalkthrough({
  project,
}: ProjectWalkthroughProps): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState(0);
  const gestureStartX = useRef<number | null>(null);
  const currentSlide = project.slides[currentIndex];

  const move = (step: -1 | 1): void => {
    setCurrentIndex((index) =>
      getAdjacentSlideIndex(index, step, project.slides.length),
    );
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
  };

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>): void => {
    gestureStartX.current = event.clientX;
  };

  const handleMouseUp = (event: MouseEvent<HTMLDivElement>): void => {
    if (gestureStartX.current === null) return;
    const step = getSwipeStep(gestureStartX.current, event.clientX);
    gestureStartX.current = null;
    if (step !== 0) move(step);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>): void => {
    gestureStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>): void => {
    if (gestureStartX.current === null) return;
    const step = getSwipeStep(
      gestureStartX.current,
      event.changedTouches[0]?.clientX ?? gestureStartX.current,
    );
    gestureStartX.current = null;
    if (step !== 0) move(step);
  };

  return (
    <section
      className="border border-terminal-green/25 bg-surface-deep"
      aria-labelledby={`${project.id}-walkthrough-heading`}
    >
      <div className="flex flex-col gap-3 border-b border-terminal-green/20 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-mono text-xs text-terminal-green/65">
            {project.title.toUpperCase()} / SYSTEM WALKTHROUGH
          </p>
          <h2
            id={`${project.id}-walkthrough-heading`}
            className="mt-1 text-xl font-semibold text-terminal-green"
          >
            {currentSlide.title}
          </h2>
        </div>
        <p className="font-mono text-sm text-terminal-green" aria-live="polite">
          {String(currentIndex + 1).padStart(2, "0")} /{" "}
          {String(project.slides.length).padStart(2, "0")}
        </p>
      </div>

      <div
        data-project-carousel={project.id}
        data-slide-index={currentIndex}
        className="touch-pan-y select-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-terminal-green"
        role="group"
        aria-roledescription="carousel"
        aria-label={`${project.title} product walkthrough. Use left and right arrow keys to change slides.`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => {
          gestureStartX.current = null;
        }}
      >
        <figure>
          <div className="relative aspect-[2/1] overflow-hidden bg-[#10111a]">
            <Image
              key={currentSlide.id}
              src={currentSlide.image}
              alt={currentSlide.alt}
              draggable={false}
              fill
              sizes="(min-width: 1024px) 960px, (min-width: 640px) 90vw, 100vw"
              className="object-contain motion-safe:animate-[fadeIn_250ms_ease-out]"
              priority={currentIndex === 0}
            />
          </div>
          <figcaption className="min-h-28 border-t border-terminal-green/20 px-4 py-4 text-base leading-relaxed text-terminal-green/75 sm:min-h-24 sm:px-6">
            {currentSlide.caption}
          </figcaption>
        </figure>

        <div className="flex flex-col gap-4 border-t border-terminal-green/20 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div
            className="grid flex-1 grid-flow-col gap-2 sm:max-w-xs"
            aria-hidden="true"
          >
            {project.slides.map((slide, index) => (
              <span
                key={slide.id}
                className={`h-1 ${
                  index === currentIndex
                    ? "bg-terminal-green"
                    : "bg-terminal-green/20"
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex">
            <button
              type="button"
              onClick={() => move(-1)}
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-terminal-green/35 px-4 font-mono text-sm text-terminal-green transition-colors hover:bg-terminal-green/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green motion-reduce:transition-none"
              aria-label={`Previous ${project.title} slide`}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Previous
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-terminal-green px-4 font-mono text-sm font-semibold text-surface-deep transition-colors hover:bg-terminal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-soft focus-visible:ring-offset-2 focus-visible:ring-offset-surface-deep motion-reduce:transition-none"
              aria-label={`Next ${project.title} slide`}
            >
              Next
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ClientWorkDetailProps {
  project: ClientProject;
}

/** Render one isolated Client Work case study with its own carousel state. */
export function ClientWorkDetail({
  project,
}: ClientWorkDetailProps): React.ReactElement {
  return (
    <main className="min-h-screen bg-surface-base p-4 text-terminal-green grid-dots sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-terminal-green/25 pb-5">
          <Link
            href="/projects#client-work"
            className="inline-flex min-h-12 items-center gap-2 font-mono text-sm text-terminal-green/70 transition-colors hover:text-terminal-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green motion-reduce:transition-none"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to project archive
          </Link>
          <span className="font-mono text-xs text-terminal-green/55">
            DEDICATED CASE FILE / {project.id}
          </span>
        </div>

        <article aria-labelledby={`${project.id}-heading`}>
          <header className="grid gap-7 py-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div>
              <p className="font-mono text-sm text-terminal-green/60">
                SELECTED PROJECT / LIVE SYSTEM
              </p>
              <h1
                id={`${project.id}-heading`}
                className="mt-4 break-words text-5xl font-bold tracking-tight text-terminal-green sm:text-7xl"
              >
                {project.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-terminal-green/75">
                {project.summary}
              </p>
            </div>
            <a
              href={project.deploymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-fit items-center gap-2 border border-terminal-green/40 px-4 font-mono text-sm text-terminal-green transition-colors hover:bg-terminal-green/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green motion-reduce:transition-none"
            >
              {project.deploymentLabel}
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          </header>

          <div className="mb-10 grid border-y border-terminal-green/20 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="py-7 lg:border-r lg:border-terminal-green/20 lg:pr-10">
              <p className="font-mono text-xs text-terminal-green/60">
                THE NEED
              </p>
              <p className="mt-3 text-base leading-relaxed text-terminal-green/75">
                {project.need}
              </p>
            </div>
            <div className="border-t border-terminal-green/20 py-7 lg:border-t-0 lg:pl-10">
              <p className="font-mono text-xs text-terminal-green/60">
                DELIVERED WORKFLOW
              </p>
              <ol className="mt-3 divide-y divide-terminal-green/15">
                {project.delivery.map((item, index) => (
                  <li
                    key={item}
                    className="grid grid-cols-[2rem_1fr] gap-3 py-3 text-base leading-relaxed text-terminal-green/75 first:pt-0 last:pb-0"
                  >
                    <span className="font-mono text-xs text-terminal-green/50">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <ProjectWalkthrough project={project} />

          <section
            className="my-14 border border-terminal-green bg-terminal-green p-6 text-surface-deep sm:my-20 sm:p-10"
            aria-labelledby={`${project.id}-cta-heading`}
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wider">
                  {CLIENT_WORK_CTA.eyebrow}
                </p>
                <h2
                  id={`${project.id}-cta-heading`}
                  className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl"
                >
                  {CLIENT_WORK_CTA.title}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-surface-deep/80">
                  {CLIENT_WORK_CTA.body}
                </p>
              </div>
              <Link
                href={CLIENT_WORK_CTA.href}
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-surface-deep bg-surface-deep px-5 font-mono text-sm font-semibold text-terminal-green transition-colors hover:bg-surface-night focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-deep focus-visible:ring-offset-2 focus-visible:ring-offset-terminal-green motion-reduce:transition-none"
              >
                {CLIENT_WORK_CTA.label}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
