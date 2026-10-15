"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  type KeyboardEvent,
  type MouseEvent,
  type TouchEvent,
  useRef,
  useState,
} from "react";

import {
  type ClientProject,
  getAdjacentSlideIndex,
  getSwipeStep,
} from "./content";

import styles from "./client-work.module.css";

interface ProjectWalkthroughProps {
  project: ClientProject;
}

/** Browse authentic screenshots with buttons, keyboard and swipe controls. */
export function ProjectWalkthrough({
  project,
}: ProjectWalkthroughProps): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState(0);
  const gestureStartX = useRef<number | null>(null);

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
      className={styles.walkthrough}
      aria-label={`${project.title} / System walkthrough`}
    >
      <div className={styles.walkthroughHeader}>
        <div>
          <p className="oc-small oc-soft">My build / {project.title}</p>
          {/* Every slide is in the document; only the active one is shown. */}
          {project.slides.map((slide, index) => (
            <h3
              key={slide.id}
              id={`${project.id}-slide-${slide.id}`}
              hidden={index !== currentIndex}
            >
              {slide.title}
            </h3>
          ))}
        </div>
        <p className="oc-small oc-soft" aria-live="polite">
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
        {project.slides.map((slide, index) => (
          <figure
            key={slide.id}
            hidden={index !== currentIndex}
            aria-labelledby={`${project.id}-slide-${slide.id}`}
          >
            <div className={styles.slideImage}>
              <Image
                src={slide.image}
                alt={slide.alt}
                draggable={false}
                fill
                sizes="(min-width: 1024px) 960px, (min-width: 640px) 90vw, 100vw"
                className="object-contain"
                priority={index === 0}
              />
            </div>
            <figcaption className={styles.slideCaption}>
              {slide.caption}
            </figcaption>
          </figure>
        ))}

        <div className={styles.walkthroughControls}>
          <div
            className={styles.slideMarkers}
            aria-hidden="true"
          >
            {project.slides.map((slide, index) => (
              <span
                key={slide.id}
                data-active={index === currentIndex}
              />
            ))}
          </div>

          <div className={styles.walkthroughButtons}>
            <button
              type="button"
              onClick={() => move(-1)}
              className="oc-control"
              aria-label={`Previous ${project.title} slide`}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Previous
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              className="oc-control"
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
