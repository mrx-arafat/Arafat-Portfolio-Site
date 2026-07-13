"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ComponentRef,
  type ReactElement,
} from "react";
import { OrbitControls, Stars } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import type { CategoryMeta, GalaxyHeroProps } from "../types";
import { CoreStar } from "./core-star";
import { Planet } from "./planet";
import { useRadialTexture } from "./textures";

type OrbitControlsRef = ComponentRef<typeof OrbitControls>;

export interface GalaxySceneProps extends GalaxyHeroProps {
  isMobile: boolean;
}

interface OrbitConfig {
  category: CategoryMeta;
  planetRadius: number;
  orbitRadius: number;
  tiltX: number;
  tiltZ: number;
  phase: number;
  speed: number;
  seed: number;
  hasRing: boolean;
}

interface DipState {
  phase: "in" | "out";
  elapsed: number;
  categoryId: string;
  fromPosition: THREE.Vector3;
  toPosition: THREE.Vector3;
  fromTarget: THREE.Vector3;
  toTarget: THREE.Vector3;
  homePosition: THREE.Vector3;
  homeTarget: THREE.Vector3;
}

const DIP_IN_SECONDS = 0.6;
const DIP_OUT_SECONDS = 0.55;
const GOLDEN_ANGLE = 2.399963;
const SYSTEM_SPIN_SPEED = 0.045;
const STARFIELD_DRIFT_SPEED = 0.006;

interface NebulaSpec {
  position: readonly [number, number, number];
  scale: number;
  color: string;
  opacity: number;
}

const NEBULA_SPRITES: readonly NebulaSpec[] = [
  { position: [-18, 6, -42], scale: 55, color: "#4c6ef5", opacity: 0.1 },
  { position: [16, -4, -48], scale: 62, color: "#7048e8", opacity: 0.09 },
  { position: [2, 11, -55], scale: 70, color: "#0ca678", opacity: 0.06 },
];

/** Deterministic pseudo-random in [-0.5, 0.5] for per-orbit variation. */
function jitter(index: number, salt: number): number {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value) - 0.5;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function NebulaBackdrop({ texture }: { texture: THREE.Texture }): ReactElement {
  return (
    <group>
      {NEBULA_SPRITES.map((spec) => (
        <sprite
          key={`${spec.position[0]}-${spec.position[2]}`}
          position={[spec.position[0], spec.position[1], spec.position[2]]}
          scale={[spec.scale, spec.scale, 1]}
        >
          <spriteMaterial
            map={texture}
            color={spec.color}
            transparent
            opacity={spec.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
}

/** Full galaxy scene graph: starfield, nebula, core star, planets, controls, camera dip. */
export function GalaxyScene({
  categories,
  skillCounts,
  onPlanetSelect,
  isMobile,
}: GalaxySceneProps): ReactElement {
  const camera = useThree((state) => state.camera);
  const controlsRef = useRef<OrbitControlsRef | null>(null);
  const systemRef = useRef<THREE.Group>(null);
  const backdropRef = useRef<THREE.Group>(null);
  const dipRef = useRef<DipState | null>(null);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  const glowTexture = useRadialTexture("glow");
  const nebulaTexture = useRadialTexture("nebula");

  const onPlanetSelectRef = useRef(onPlanetSelect);
  useEffect(() => {
    onPlanetSelectRef.current = onPlanetSelect;
  }, [onPlanetSelect]);

  const orbits = useMemo<OrbitConfig[]>(() => {
    const sorted = [...categories].sort((a, b) => a.order - b.order);
    const maxCount = Math.max(1, ...sorted.map((c) => skillCounts[c.id] ?? 0));
    const ringIds = new Set(
      [...sorted]
        .sort((a, b) => (skillCounts[b.id] ?? 0) - (skillCounts[a.id] ?? 0))
        .slice(0, 2)
        .map((c) => c.id),
    );
    return sorted.map((category, index) => {
      const orbitRadius = 4.4 + index * 0.95;
      const count = skillCounts[category.id] ?? 0;
      return {
        category,
        planetRadius: 0.42 + 0.62 * Math.sqrt(count / maxCount),
        orbitRadius,
        tiltX: 0.14 + jitter(index, 1) * 0.16,
        tiltZ: jitter(index, 2) * 0.24,
        phase: index * GOLDEN_ANGLE,
        speed: 0.55 / Math.pow(orbitRadius, 0.85),
        seed: 3.7 + index * 1.618,
        hasRing: ringIds.has(category.id),
      };
    });
  }, [categories, skillCounts]);

  const handlePlanetSelect = useCallback(
    (
      categoryId: string,
      worldPosition: THREE.Vector3,
      planetRadius: number,
    ): void => {
      if (dipRef.current) return;
      const controls = controlsRef.current;
      const homeTarget = controls
        ? controls.target.clone()
        : new THREE.Vector3();
      const approach = camera.position
        .clone()
        .sub(worldPosition)
        .normalize()
        .multiplyScalar(Math.max(planetRadius * 5, 3.2));
      dipRef.current = {
        phase: "in",
        elapsed: 0,
        categoryId,
        fromPosition: camera.position.clone(),
        toPosition: worldPosition.clone().add(approach),
        fromTarget: homeTarget.clone(),
        toTarget: worldPosition.clone(),
        homePosition: camera.position.clone(),
        homeTarget,
      };
      if (controls) controls.enabled = false;
    },
    [camera],
  );

  useFrame((_, delta) => {
    const dip = dipRef.current;

    // Idle ambience: spin the planetary system; counter-drift the backdrop for parallax.
    if (!dip && systemRef.current) {
      systemRef.current.rotation.y += delta * SYSTEM_SPIN_SPEED;
    }
    if (backdropRef.current) {
      backdropRef.current.rotation.y -= delta * STARFIELD_DRIFT_SPEED;
    }

    if (!dip) return;

    dip.elapsed += delta;
    const duration = dip.phase === "in" ? DIP_IN_SECONDS : DIP_OUT_SECONDS;
    const progress = Math.min(dip.elapsed / duration, 1);
    const eased = easeInOutCubic(progress);
    camera.position.lerpVectors(dip.fromPosition, dip.toPosition, eased);
    lookTarget.lerpVectors(dip.fromTarget, dip.toTarget, eased);
    camera.lookAt(lookTarget);

    if (progress < 1) return;

    if (dip.phase === "in") {
      onPlanetSelectRef.current(dip.categoryId);
      dipRef.current = {
        ...dip,
        phase: "out",
        elapsed: 0,
        fromPosition: camera.position.clone(),
        toPosition: dip.homePosition.clone(),
        fromTarget: dip.toTarget.clone(),
        toTarget: dip.homeTarget.clone(),
      };
    } else {
      dipRef.current = null;
      const controls = controlsRef.current;
      if (controls) {
        controls.target.copy(dip.homeTarget);
        controls.enabled = true;
        controls.update();
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.45} />

      <group ref={backdropRef}>
        <Stars
          radius={90}
          depth={40}
          count={isMobile ? 1600 : 4200}
          factor={3.5}
          saturation={0}
          fade
          speed={0.5}
        />
        <NebulaBackdrop texture={nebulaTexture} />
      </group>

      <group ref={systemRef}>
        <CoreStar haloTexture={glowTexture} />
        {orbits.map((orbit) => (
          <Planet
            key={orbit.category.id}
            category={orbit.category}
            planetRadius={orbit.planetRadius}
            orbitRadius={orbit.orbitRadius}
            tiltX={orbit.tiltX}
            tiltZ={orbit.tiltZ}
            phase={orbit.phase}
            speed={orbit.speed}
            sphereDetail={isMobile ? 24 : 48}
            seed={orbit.seed}
            hasRing={orbit.hasRing}
            labelBelow={orbits.indexOf(orbit) % 2 === 1}
            haloTexture={glowTexture}
            onSelect={handlePlanetSelect}
          />
        ))}
      </group>

      <OrbitControls
        ref={controlsRef}
        makeDefault
        target={[0, -1.6, 0]}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.55}
        minPolarAngle={Math.PI * 0.22}
        maxPolarAngle={Math.PI * 0.58}
      />
    </>
  );
}
