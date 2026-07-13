"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";

type GradientStop = readonly [offset: number, color: string];

/** Tight white-hot falloff — tinted per-use via sprite material color. */
const GLOW_STOPS: readonly GradientStop[] = [
  [0, "rgba(255,255,255,1)"],
  [0.2, "rgba(255,255,255,0.7)"],
  [0.45, "rgba(255,255,255,0.22)"],
  [0.75, "rgba(255,255,255,0.05)"],
  [1, "rgba(255,255,255,0)"],
];

/** Very soft, wide falloff for large faint nebula sprites. */
const NEBULA_STOPS: readonly GradientStop[] = [
  [0, "rgba(255,255,255,0.5)"],
  [0.35, "rgba(255,255,255,0.2)"],
  [0.7, "rgba(255,255,255,0.06)"],
  [1, "rgba(255,255,255,0)"],
];

function createRadialTexture(
  stops: readonly GradientStop[],
  size: number,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (context) {
    const half = size / 2;
    const gradient = context.createRadialGradient(half, half, 0, half, half, half);
    for (const [offset, color] of stops) {
      gradient.addColorStop(offset, color);
    }
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Radial-gradient canvas texture, disposed on unmount. Client-only. */
export function useRadialTexture(variant: "glow" | "nebula"): THREE.CanvasTexture {
  const texture = useMemo(
    () =>
      variant === "glow"
        ? createRadialTexture(GLOW_STOPS, 128)
        : createRadialTexture(NEBULA_STOPS, 256),
    [variant],
  );

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  return texture;
}
