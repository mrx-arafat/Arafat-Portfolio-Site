"use client";

import * as THREE from "three";

/** Derived light/base/dark palette for a planet surface from its category hex. */
export interface PlanetPalette {
  dark: THREE.Color;
  base: THREE.Color;
  light: THREE.Color;
}

/** Build a 3-stop surface palette from a category color. */
export function buildPlanetPalette(hex: string): PlanetPalette {
  const base = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  base.getHSL(hsl);

  const dark = new THREE.Color().setHSL(
    (hsl.h + 0.985) % 1,
    Math.min(1, hsl.s * 1.1),
    Math.max(0.06, hsl.l * 0.38),
  );
  const light = new THREE.Color().setHSL(
    (hsl.h + 0.02) % 1,
    Math.max(0, hsl.s * 0.75),
    Math.min(0.92, hsl.l * 1.45 + 0.08),
  );
  return { dark, base, light };
}

export const PLANET_VERTEX = /* glsl */ `
varying vec3 vObjPos;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;

void main() {
  vObjPos = position;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const PLANET_FRAGMENT = /* glsl */ `
uniform vec3 uColorDark;
uniform vec3 uColorBase;
uniform vec3 uColorLight;
uniform float uSeed;
uniform float uTime;
uniform float uHover;
uniform float uBandFreq;
uniform float uTurbulence;

varying vec3 vObjPos;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
    f.z);
}

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.02;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec3 p = normalize(vObjPos);

  // Latitude bands warped by turbulence — gas-giant flow.
  float swirl = fbm(p * 3.0 + uSeed + vec3(uTime * 0.008, 0.0, 0.0));
  float bandWave = p.y * uBandFreq + swirl * uTurbulence + uSeed;
  float band = 0.5 + 0.5 * sin(bandWave * 6.28318);
  band = smoothstep(0.12, 0.88, band);
  vec3 surface = mix(uColorDark, uColorBase, band);

  // Storm cells drifting slowly.
  float storms = smoothstep(
    0.6, 0.92,
    fbm(p * 5.5 + uSeed * 3.7 + vec3(uTime * 0.015, 0.0, uTime * 0.01)));
  surface = mix(surface, uColorLight, storms * 0.65);

  // Subtle polar caps.
  float caps = smoothstep(0.74, 0.96, abs(p.y));
  surface = mix(surface, uColorLight, caps * 0.45);

  // Sun sits at the world origin: day/night terminator.
  vec3 normal = normalize(vWorldNormal);
  vec3 sunDir = normalize(-vWorldPos);
  float ndl = clamp(dot(normal, sunDir), 0.0, 1.0);
  float daylight = pow(ndl, 0.8);
  float light = 0.09 + 0.91 * daylight;
  light *= 1.0 + uHover * 0.3;

  // Fresnel atmosphere rim, tinted with the light palette stop.
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float fresnel = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), 2.4);
  vec3 atmosphere =
    uColorLight * fresnel * (0.35 + 0.65 * daylight) * (0.9 + uHover * 0.6);

  vec3 color = surface * light + atmosphere;
  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}
`;

export const SUN_VERTEX = /* glsl */ `
varying vec3 vObjPos;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;

void main() {
  vObjPos = position;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const SUN_FRAGMENT = /* glsl */ `
uniform float uTime;

varying vec3 vObjPos;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
    f.z);
}

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p *= 2.03;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec3 p = normalize(vObjPos);

  // Boiling granulation: two counter-drifting fbm layers.
  float granules =
    fbm(p * 6.0 + vec3(uTime * 0.06, uTime * 0.04, 0.0)) * 0.65 +
    fbm(p * 13.0 - vec3(0.0, uTime * 0.08, uTime * 0.05)) * 0.35;

  vec3 deep = vec3(0.95, 0.42, 0.08);
  vec3 mid = vec3(1.0, 0.76, 0.32);
  vec3 hot = vec3(1.0, 0.98, 0.88);
  vec3 color = mix(deep, mid, smoothstep(0.25, 0.6, granules));
  color = mix(color, hot, smoothstep(0.62, 0.95, granules));

  // Limb darkening toward the edge, thin bright limb rim.
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float facing = clamp(dot(normalize(vWorldNormal), viewDir), 0.0, 1.0);
  color *= 0.55 + 0.45 * pow(facing, 0.6);
  float limb = pow(1.0 - facing, 3.0);
  color += vec3(1.0, 0.55, 0.15) * limb * 0.8;

  gl_FragColor = vec4(color * 1.25, 1.0);
  #include <colorspace_fragment>
}
`;

export const RING_VERTEX = /* glsl */ `
varying vec2 vPos;

void main() {
  vPos = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const RING_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform float uInner;
uniform float uOuter;
uniform float uSeed;

varying vec2 vPos;

void main() {
  float radius = length(vPos);
  float t = clamp((radius - uInner) / (uOuter - uInner), 0.0, 1.0);

  // Soft ringlets + two Cassini-like gaps.
  float ringlets = 0.7 + 0.3 * sin((t * 22.0 + uSeed) * 3.14159);
  float gaps =
    smoothstep(0.02, 0.06, abs(t - 0.42)) *
    smoothstep(0.015, 0.05, abs(t - 0.72));
  float edgeFade = smoothstep(0.0, 0.08, t) * (1.0 - smoothstep(0.85, 1.0, t));

  float alpha = ringlets * gaps * edgeFade * 0.55;
  vec3 color = mix(uColor, vec3(0.92, 0.9, 0.85), 0.55 + 0.25 * ringlets);
  gl_FragColor = vec4(color, alpha);
  #include <colorspace_fragment>
}
`;
