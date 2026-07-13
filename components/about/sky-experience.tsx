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
