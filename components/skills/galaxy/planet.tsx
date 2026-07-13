"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { Billboard, Html } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

import type { CategoryMeta } from "../types";
import {
  buildPlanetPalette,
  PLANET_FRAGMENT,
  PLANET_VERTEX,
  RING_FRAGMENT,
  RING_VERTEX,
} from "./planet-material";

export interface PlanetProps {
  category: CategoryMeta;
  /** Sphere radius in world units (already scaled by skill count). */
  planetRadius: number;
  orbitRadius: number;
  /** Orbit plane tilt around X, radians. */
  tiltX: number;
  /** Orbit plane tilt around Z, radians. */
  tiltZ: number;
  /** Starting angle along the orbit, radians. */
  phase: number;
  /** Angular speed, radians per second. */
  speed: number;
  /** Sphere segment count (lower on mobile). */
  sphereDetail: number;
  /** Deterministic per-planet seed for surface variation. */
  seed: number;
  /** Saturn-style ring for standout planets. */
  hasRing: boolean;
  /** Alternate label placement to reduce label collisions. */
  labelBelow: boolean;
  haloTexture: THREE.Texture;
  onSelect: (
    categoryId: string,
    worldPosition: THREE.Vector3,
    planetRadius: number,
  ) => void;
}

/** One orbiting category planet: shader surface, atmosphere rim, optional ring, orbit line, persistent label. */
export function Planet({
  category,
  planetRadius,
  orbitRadius,
  tiltX,
  tiltZ,
  phase,
  speed,
  sphereDetail,
  seed,
  hasRing,
  labelBelow,
  haloTexture,
  onSelect,
}: PlanetProps): ReactElement {
  const anchorRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const color = useMemo(() => new THREE.Color(category.color), [category.color]);

  const surfaceMaterial = useMemo(() => {
    const palette = buildPlanetPalette(category.color);
    return new THREE.ShaderMaterial({
      vertexShader: PLANET_VERTEX,
      fragmentShader: PLANET_FRAGMENT,
      uniforms: {
        uColorDark: { value: palette.dark },
        uColorBase: { value: palette.base },
        uColorLight: { value: palette.light },
        uSeed: { value: seed },
        uTime: { value: 0 },
        uHover: { value: 0 },
        uBandFreq: { value: 2.4 + ((seed * 7.3) % 1) * 4.2 },
        uTurbulence: { value: 1.6 + ((seed * 3.1) % 1) * 1.9 },
      },
    });
  }, [category.color, seed]);

  const ringMaterial = useMemo(() => {
    if (!hasRing) return null;
    return new THREE.ShaderMaterial({
      vertexShader: RING_VERTEX,
      fragmentShader: RING_FRAGMENT,
      uniforms: {
        uColor: { value: new THREE.Color(category.color) },
        uInner: { value: planetRadius * 1.4 },
        uOuter: { value: planetRadius * 2.15 },
        uSeed: { value: seed * 10 },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, [category.color, hasRing, planetRadius, seed]);

  useEffect(() => {
    return () => {
      surfaceMaterial.dispose();
      ringMaterial?.dispose();
    };
  }, [surfaceMaterial, ringMaterial]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = "pointer";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  useFrame(({ clock }, delta) => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const angle = phase + clock.elapsedTime * speed;
    anchor.position.set(
      Math.cos(angle) * orbitRadius,
      0,
      Math.sin(angle) * orbitRadius,
    );
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.22;
    }
    const uniforms = surfaceMaterial.uniforms;
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uHover.value = THREE.MathUtils.lerp(
      uniforms.uHover.value as number,
      hovered ? 1 : 0,
      Math.min(1, delta * 8),
    );
  });

  const handlePointerOver = useCallback((event: ThreeEvent<PointerEvent>): void => {
    event.stopPropagation();
    setHovered(true);
  }, []);

  const handlePointerOut = useCallback((): void => {
    setHovered(false);
  }, []);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>): void => {
      event.stopPropagation();
      const mesh = meshRef.current;
      if (!mesh) return;
      onSelect(category.id, mesh.getWorldPosition(new THREE.Vector3()), planetRadius);
    },
    [category.id, onSelect, planetRadius],
  );

  return (
    <group rotation={[tiltX, 0, tiltZ]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.015, orbitRadius + 0.015, 160]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.13}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <group ref={anchorRef}>
        <mesh
          ref={meshRef}
          material={surfaceMaterial}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <sphereGeometry args={[planetRadius, sphereDetail, sphereDetail]} />
        </mesh>

        {ringMaterial && (
          <mesh rotation={[Math.PI / 2.35, 0.18, 0]} material={ringMaterial}>
            <ringGeometry
              args={[planetRadius * 1.4, planetRadius * 2.15, 128]}
            />
          </mesh>
        )}

        <sprite scale={[planetRadius * 3.6, planetRadius * 3.6, 1]}>
          <spriteMaterial
            map={haloTexture}
            color={color}
            transparent
            opacity={hovered ? 0.5 : 0.22}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>

        {hovered && (
          <Billboard>
            <mesh>
              <ringGeometry args={[planetRadius * 1.35, planetRadius * 1.5, 48]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.85}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </Billboard>
        )}

        <Html
          center
          position={[
            0,
            (planetRadius * (hasRing ? 2.1 : 1.55) + 0.55) *
              (labelBelow ? -1 : 1),
            0,
          ]}
          zIndexRange={[40, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              whiteSpace: "nowrap",
              fontSize: "11px",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 500,
              color: hovered ? category.color : "rgba(226, 230, 242, 0.78)",
              textShadow: hovered
                ? `0 0 12px ${category.color}aa, 0 1px 3px rgba(0,0,0,0.9)`
                : "0 1px 3px rgba(0,0,0,0.9)",
              transition: "color 200ms ease, text-shadow 200ms ease",
            }}
          >
            {category.label}
          </div>
        </Html>
      </group>
    </group>
  );
}
