/** Authored sky keyframes + pure sampling. No three.js imports — unit-testable. */

export type Rgb = [number, number, number];

export interface SkyStop {
  top: Rgb;
  mid: Rgb;
  bottom: Rgb;
  sun: Rgb;
  /** Sun/moon vertical position in UV space (0 = horizon, 1 = zenith). */
  sunY: number;
  /** Sun glow intensity 0–1. */
  sunI: number;
  /** Star field opacity 0–1. */
  stars: number;
  /** City bokeh opacity 0–1. */
  bokeh: number;
}

/**
 * Dark theme — Gotham night watch: storm dusk → deepest night → cold dawn.
 * `sun` fields drive the BAT-SIGNAL (bat-yellow #ffd60a) — brightest mid-scroll,
 * projected high on the cloud deck. Bottoms carry faint sodium city glow.
 */
export const NIGHT_KEYFRAMES: SkyStop[] = [
  { top: [0.05, 0.07, 0.13], mid: [0.16, 0.19, 0.26], bottom: [0.32, 0.24, 0.14], sun: [0.24, 0.75, 0.47], sunY: 0.30, sunI: 0.25, stars: 0.10, bokeh: 0.50 },
  { top: [0.03, 0.045, 0.09], mid: [0.12, 0.15, 0.21], bottom: [0.28, 0.20, 0.11], sun: [0.24, 0.75, 0.47], sunY: 0.42, sunI: 0.55, stars: 0.30, bokeh: 0.70 },
  { top: [0.012, 0.018, 0.045], mid: [0.07, 0.09, 0.14], bottom: [0.20, 0.14, 0.07], sun: [0.24, 0.75, 0.47], sunY: 0.52, sunI: 0.90, stars: 0.60, bokeh: 0.90 },
  { top: [0.008, 0.012, 0.035], mid: [0.06, 0.08, 0.13], bottom: [0.18, 0.12, 0.06], sun: [0.24, 0.75, 0.47], sunY: 0.55, sunI: 1.00, stars: 0.70, bokeh: 1.00 },
  { top: [0.03, 0.05, 0.10], mid: [0.14, 0.18, 0.24], bottom: [0.24, 0.20, 0.14], sun: [0.24, 0.75, 0.47], sunY: 0.36, sunI: 0.40, stars: 0.35, bokeh: 0.60 },
  { top: [0.16, 0.22, 0.32], mid: [0.32, 0.38, 0.46], bottom: [0.48, 0.44, 0.36], sun: [0.24, 0.75, 0.47], sunY: 0.20, sunI: 0.10, stars: 0.05, bokeh: 0.30 },
];

/** Light theme — Gotham dawn: cold grey-blue mist → desaturated overcast steel day. */
export const DAY_KEYFRAMES: SkyStop[] = [
  { top: [0.55, 0.62, 0.72], mid: [0.66, 0.71, 0.78], bottom: [0.76, 0.79, 0.83], sun: [0.95, 0.92, 0.80], sunY: 0.30, sunI: 0.20, stars: 0, bokeh: 0.10 },
  { top: [0.58, 0.65, 0.75], mid: [0.70, 0.74, 0.80], bottom: [0.80, 0.82, 0.85], sun: [0.95, 0.92, 0.80], sunY: 0.40, sunI: 0.30, stars: 0, bokeh: 0.08 },
  { top: [0.62, 0.68, 0.77], mid: [0.73, 0.77, 0.82], bottom: [0.83, 0.85, 0.87], sun: [0.95, 0.92, 0.80], sunY: 0.52, sunI: 0.40, stars: 0, bokeh: 0.05 },
  { top: [0.60, 0.66, 0.74], mid: [0.71, 0.75, 0.79], bottom: [0.81, 0.83, 0.85], sun: [0.95, 0.92, 0.80], sunY: 0.60, sunI: 0.35, stars: 0, bokeh: 0.04 },
  { top: [0.56, 0.61, 0.68], mid: [0.67, 0.70, 0.74], bottom: [0.77, 0.79, 0.81], sun: [0.95, 0.92, 0.80], sunY: 0.55, sunI: 0.28, stars: 0, bokeh: 0.03 },
  { top: [0.52, 0.56, 0.62], mid: [0.63, 0.66, 0.70], bottom: [0.73, 0.75, 0.77], sun: [0.95, 0.92, 0.80], sunY: 0.48, sunI: 0.22, stars: 0, bokeh: 0.02 },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

/** Clamped piecewise-linear sample of the keyframe track at t ∈ [0,1]. */
export function sampleSky(frames: SkyStop[], t: number): SkyStop {
  const clamped = Math.min(1, Math.max(0, t));
  const scaled = clamped * (frames.length - 1);
  const i = Math.min(frames.length - 2, Math.floor(scaled));
  const f = scaled - i;
  const a = frames[i];
  const b = frames[i + 1];
  if (f === 0) return { ...a };
  if (f === 1 || (i === frames.length - 2 && clamped === 1)) return { ...b };
  return {
    top: lerpRgb(a.top, b.top, f),
    mid: lerpRgb(a.mid, b.mid, f),
    bottom: lerpRgb(a.bottom, b.bottom, f),
    sun: lerpRgb(a.sun, b.sun, f),
    sunY: lerp(a.sunY, b.sunY, f),
    sunI: lerp(a.sunI, b.sunI, f),
    stars: lerp(a.stars, b.stars, f),
    bokeh: lerp(a.bokeh, b.bokeh, f),
  };
}

function rgbCss([r, g, b]: Rgb): string {
  const to255 = (v: number): number => Math.round(v * 255);
  return `rgb(${to255(r)}, ${to255(g)}, ${to255(b)})`;
}

/** Static-fallback CSS gradient for a given progress. */
export function cssBackdrop(frames: SkyStop[], t: number): string {
  const s = sampleSky(frames, t);
  return `linear-gradient(to top, ${rgbCss(s.bottom)}, ${rgbCss(s.mid)}, ${rgbCss(s.top)})`;
}
