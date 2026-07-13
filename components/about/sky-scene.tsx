"use client";

import { useLayoutEffect, useMemo, useRef, type ReactElement } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import {
  DAY_KEYFRAMES,
  NIGHT_KEYFRAMES,
  sampleSky,
} from "@/components/about/sky-palette";

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.9999, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec3 uTop;
uniform vec3 uMid;
uniform vec3 uBottom;
uniform vec3 uSun;
uniform float uSunY;
uniform float uSunI;
uniform float uAspect;
uniform float uTime;

float hash1(float n) {
  return fract(sin(n * 127.1 + 311.7) * 43758.5453123);
}

void main() {
  vec3 col = mix(uBottom, uMid, smoothstep(0.0, 0.55, vUv.y));
  col = mix(col, uTop, smoothstep(0.45, 1.0, vUv.y));

  // subtle vignette
  float vig = 1.0 - smoothstep(0.35, 1.25, distance(vUv, vec2(0.5)));

  // rare storm flash, strongest toward the frame edges
  float slot = floor(uTime * 0.4);
  float flash = step(0.97, hash1(slot)) * (1.0 - fract(uTime * 0.4));
  col += flash * 0.05 * (1.0 - vig);

  // cloud spot where the signal lands (elongated glow, sweeps with the beam)
  float sweep = 0.06 * sin(uTime * 0.314159);
  vec2 p = vec2(vUv.x * uAspect, vUv.y);
  vec2 spot = vec2((0.5 + sweep) * uAspect, uSunY);
  vec2 dd = p - spot;
  dd.x *= 0.6;
  float d = length(dd);
  col += uSun * uSunI * 0.55 * exp(-d * d * 18.0);   // wide glow
  col += uSun * uSunI * 0.85 * exp(-d * d * 90.0);   // bright core on the clouds

  col *= mix(0.82, 1.0, vig);

  gl_FragColor = vec4(col, 1.0);
}
`;

function scrollProgress(): number {
  const max = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  return Math.min(1, Math.max(0, window.scrollY / max));
}

/** Deterministic pseudo-random in [0,1) seeded from index + salt. */
function seeded(i: number, salt: number): number {
  const v = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

function makePoints(
  count: number,
  spread: [number, number, number],
  center: [number, number, number],
): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    arr[i * 3] = center[0] + (Math.random() - 0.5) * spread[0];
    arr[i * 3 + 1] = center[1] + (Math.random() - 0.5) * spread[1];
    arr[i * 3 + 2] = center[2] + (Math.random() - 0.5) * spread[2];
  }
  return arr;
}

const RAIN_WRAP = 20;

export interface SkySceneProps {
  theme: "dark" | "light";
  isMobile: boolean;
}

/** Fullscreen sky shader + 3D gotham skyline, bat-signal cone, stars, window
 *  bokeh, dust and rain. Scroll drives everything; pointer adds parallax. */
export function SkyScene({ theme, isMobile }: SkySceneProps): ReactElement {
  const frames = theme === "dark" ? NIGHT_KEYFRAMES : DAY_KEYFRAMES;
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color(0, 0, 0) },
      uMid: { value: new THREE.Color(0, 0, 0) },
      uBottom: { value: new THREE.Color(0, 0, 0) },
      uSun: { value: new THREE.Color(1, 1, 1) },
      uSunY: { value: 0.2 },
      uSunI: { value: 0.5 },
      uAspect: { value: 1.6 },
      uTime: { value: 0 },
    }),
    [],
  );

  const starMat = useRef<THREE.PointsMaterial>(null);
  const bokehMat = useRef<THREE.PointsMaterial>(null);
  const rainMat = useRef<THREE.PointsMaterial>(null);
  const dustRef = useRef<THREE.Points>(null);
  const rainRef = useRef<THREE.Points>(null);
  const cityRef = useRef<THREE.InstancedMesh>(null);
  const coneRef = useRef<THREE.Group>(null);
  const coneMat = useRef<THREE.MeshBasicMaterial>(null);
  const apexMat = useRef<THREE.MeshBasicMaterial>(null);
  const parallaxRef = useRef<THREE.Group>(null);
  const smooth = useRef(0);

  const cityCount = isMobile ? 28 : 60;

  const starPos = useMemo(
    () => makePoints(isMobile ? 180 : 420, [40, 18, 6], [0, 8, -30]),
    [isMobile],
  );
  // Window lights: positioned inside the building band.
  const bokehPos = useMemo(
    () => makePoints(isMobile ? 30 : 70, [44, 4, 8], [0, -6.5, -18]),
    [isMobile],
  );
  const dustPos = useMemo(
    () => makePoints(isMobile ? 40 : 90, [16, 10, 8], [0, 0, -6]),
    [isMobile],
  );
  const rainPos = useMemo(
    () => makePoints(isMobile ? 60 : 150, [30, RAIN_WRAP, 8], [0, 0, -10]),
    [isMobile],
  );

  // Skyline band: deterministic per-instance matrices, set once.
  useLayoutEffect(() => {
    const mesh = cityRef.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    // Light mode: shorter skyline so buildings never climb behind body text.
    const hScale = theme === "dark" ? 1 : 0.55;
    for (let i = 0; i < cityCount; i += 1) {
      const w = 0.8 + seeded(i, 1) * 1.7;
      const h = (1.5 + seeded(i, 2) * 5.5) * hScale;
      const x = -24 + (i / Math.max(1, cityCount - 1)) * 48 + (seeded(i, 3) - 0.5) * 1.2;
      const z = -14 - seeded(i, 4) * 8;
      m.makeScale(w, h, 0.8 + seeded(i, 5) * 1.4);
      m.setPosition(x, -9 + h / 2, z);
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [cityCount, theme]);

  useFrame((state, delta) => {
    const target = scrollProgress();
    smooth.current = THREE.MathUtils.damp(smooth.current, target, 3.5, delta);
    const s = sampleSky(frames, smooth.current);
    const t = state.clock.elapsedTime;

    uniforms.uTop.value.setRGB(...s.top);
    uniforms.uMid.value.setRGB(...s.mid);
    uniforms.uBottom.value.setRGB(...s.bottom);
    uniforms.uSun.value.setRGB(...s.sun);
    uniforms.uSunY.value = s.sunY;
    uniforms.uSunI.value = s.sunI;
    uniforms.uAspect.value = viewport.aspect;
    uniforms.uTime.value = t;

    if (starMat.current) starMat.current.opacity = s.stars * 0.9;
    if (bokehMat.current) bokehMat.current.opacity = s.bokeh * 0.55;
    if (rainMat.current) rainMat.current.opacity = s.stars * 0.4;
    if (dustRef.current) {
      dustRef.current.rotation.y = t * 0.008;
      dustRef.current.position.y = Math.sin(t * 0.15) * 0.3;
    }

    // Rain: constant fall, wrapped per particle (group-level wrap leaves
    // coverage gaps at the extremes and pops the whole cloud on reset).
    if (rainRef.current) {
      const attr = rainRef.current.geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      for (let i = 0; i < attr.count; i += 1) {
        let y = attr.getY(i) - delta * 6;
        if (y < -RAIN_WRAP / 2) y += RAIN_WRAP;
        attr.setY(i, y);
      }
      attr.needsUpdate = true;
    }

    // Bat-signal: intensity from the palette, slow sweep about the apex.
    if (coneMat.current) coneMat.current.opacity = s.sunI * 0.35;
    if (apexMat.current) apexMat.current.opacity = Math.min(1, s.sunI * 0.9);
    if (coneRef.current) {
      coneRef.current.rotation.z = 0.35 - Math.sin(t * 0.314159) * 0.1;
    }

    // Mouse parallax on the 3D layer (sky plane stays fixed in clip space).
    if (parallaxRef.current) {
      const g = parallaxRef.current;
      g.rotation.y = THREE.MathUtils.damp(
        g.rotation.y,
        state.pointer.x * 0.04,
        3,
        delta,
      );
      g.rotation.x = THREE.MathUtils.damp(
        g.rotation.x,
        -state.pointer.y * 0.02,
        3,
        delta,
      );
    }
  });

  return (
    <>
      <mesh frustumCulled={false} renderOrder={-1}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={uniforms}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      <group ref={parallaxRef}>
        <instancedMesh
          ref={cityRef}
          args={[undefined, undefined, cityCount]}
          frustumCulled={false}
        >
          <boxGeometry args={[1, 1, 1]} />
          {/* No lights in this Canvas: basic material, theme-keyed. Light mode
              gets pale mist silhouettes instead of near-black slabs. */}
          <meshBasicMaterial color={theme === "dark" ? "#0a0f18" : "#aebbca"} />
        </instancedMesh>

        <group ref={coneRef} position={[6, -4.5, -16]} rotation={[0, 0, 0.35]}>
          <mesh position={[0, 7, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[1.6, 14, 24, 1, true]} />
            <meshBasicMaterial
              ref={coneMat}
              color={theme === "dark" ? "#3cbf78" : "#6b7f93"}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshBasicMaterial
              ref={apexMat}
              color={theme === "dark" ? "#3cbf78" : "#6b7f93"}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>

        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[starPos, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            ref={starMat}
            size={0.09}
            sizeAttenuation
            transparent
            opacity={0}
            color="#dbe7ff"
            depthWrite={false}
          />
        </points>

        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[bokehPos, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            ref={bokehMat}
            size={0.8}
            sizeAttenuation
            transparent
            opacity={0}
            color={theme === "dark" ? "#9fd4b4" : "#ffb96b"}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>

        <points ref={dustRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[dustPos, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.035}
            sizeAttenuation
            transparent
            opacity={0.35}
            color="#f5e9d5"
            depthWrite={false}
          />
        </points>

        <points ref={rainRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[rainPos, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            ref={rainMat}
            size={0.02}
            sizeAttenuation
            transparent
            opacity={0}
            color="#9fb4cc"
            depthWrite={false}
          />
        </points>
      </group>
    </>
  );
}
