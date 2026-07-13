import { describe, expect, it } from "vitest";

import {
  NIGHT_KEYFRAMES,
  DAY_KEYFRAMES,
  sampleSky,
  cssBackdrop,
} from "@/components/about/sky-palette";

describe("keyframes", () => {
  it("both themes have six stops with sane ranges", () => {
    for (const frames of [NIGHT_KEYFRAMES, DAY_KEYFRAMES]) {
      expect(frames).toHaveLength(6);
      for (const f of frames) {
        for (const c of [...f.top, ...f.mid, ...f.bottom, ...f.sun]) {
          expect(c).toBeGreaterThanOrEqual(0);
          expect(c).toBeLessThanOrEqual(1);
        }
        expect(f.stars).toBeGreaterThanOrEqual(0);
        expect(f.stars).toBeLessThanOrEqual(1);
      }
    }
  });

  it("night sky is darkest and starriest mid-scroll", () => {
    const mid = sampleSky(NIGHT_KEYFRAMES, 0.5);
    const start = sampleSky(NIGHT_KEYFRAMES, 0);
    expect(mid.top[2]).toBeLessThan(start.top[2]);
    expect(mid.stars).toBeGreaterThan(start.stars);
  });
});

describe("sampleSky", () => {
  it("returns exact endpoint frames at t=0 and t=1", () => {
    expect(sampleSky(NIGHT_KEYFRAMES, 0)).toEqual(NIGHT_KEYFRAMES[0]);
    expect(sampleSky(NIGHT_KEYFRAMES, 1)).toEqual(NIGHT_KEYFRAMES[5]);
  });

  it("clamps t outside [0,1]", () => {
    expect(sampleSky(NIGHT_KEYFRAMES, -0.5)).toEqual(NIGHT_KEYFRAMES[0]);
    expect(sampleSky(NIGHT_KEYFRAMES, 1.5)).toEqual(NIGHT_KEYFRAMES[5]);
  });

  it("interpolates linearly between adjacent frames", () => {
    // 6 frames → segments of 0.2; t=0.5 is halfway between frames 2 and 3
    const s = sampleSky(NIGHT_KEYFRAMES, 0.5);
    const a = NIGHT_KEYFRAMES[2];
    const b = NIGHT_KEYFRAMES[3];
    expect(s.sunY).toBeCloseTo((a.sunY + b.sunY) / 2, 6);
    expect(s.top[0]).toBeCloseTo((a.top[0] + b.top[0]) / 2, 6);
  });
});

describe("cssBackdrop", () => {
  it("produces a linear-gradient with three rgb stops", () => {
    const css = cssBackdrop(NIGHT_KEYFRAMES, 0);
    expect(css).toMatch(/^linear-gradient\(to top, rgb\(/);
    expect(css.match(/rgb\(/g)).toHaveLength(3);
  });
});
