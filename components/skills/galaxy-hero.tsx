"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import { Canvas } from "@react-three/fiber";

import type { GalaxyHeroProps } from "./types";
import { GalaxyScene } from "./galaxy/galaxy-scene";

/**
 * Three.js "skill galaxy" hero: core star + one orbiting planet per category.
 * Drag orbits the camera, hover shows a label, click dips toward the planet
 * then fires onPlanetSelect. Rendering pauses while scrolled out of view.
 */
export default function GalaxyHero({
  categories,
  skillCounts,
  onPlanetSelect,
}: GalaxyHeroProps): ReactElement {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [frameloop, setFrameloop] = useState<"always" | "never">("always");
  const [isMobile] = useState<boolean>(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches,
  );

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setFrameloop(entry.isIntersecting ? "always" : "never");
      },
      { threshold: 0 },
    );
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="relative h-[80vh] w-full overflow-hidden">
      <Canvas
        aria-hidden="true"
        frameloop={frameloop}
        dpr={[1, 2]}
        camera={{ position: [0, 9.5, 20.5], fov: 50, near: 0.1, far: 220 }}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <GalaxyScene
          categories={categories}
          skillCounts={skillCounts}
          onPlanetSelect={onPlanetSelect}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
}
