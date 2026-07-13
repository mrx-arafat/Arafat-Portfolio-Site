"use client";

import { useEffect, useMemo, useRef, type ReactElement } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { SUN_FRAGMENT, SUN_VERTEX } from "./planet-material";

export interface CoreStarProps {
  haloTexture: THREE.Texture;
}

/** Central star: boiling plasma shader surface + additive sprite halo + point light. */
export function CoreStar({ haloTexture }: CoreStarProps): ReactElement {
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Sprite>(null);

  const sunMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SUN_VERTEX,
        fragmentShader: SUN_FRAGMENT,
        uniforms: { uTime: { value: 0 } },
        toneMapped: false,
      } as THREE.ShaderMaterialParameters),
    [],
  );

  useEffect(() => {
    return () => {
      sunMaterial.dispose();
    };
  }, [sunMaterial]);

  useFrame(({ clock }) => {
    const pulse = 1 + Math.sin(clock.elapsedTime * 1.4) * 0.03;
    coreRef.current?.scale.setScalar(pulse);
    haloRef.current?.scale.set(5.5 * pulse, 5.5 * pulse, 1);
    sunMaterial.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <group>
      <mesh ref={coreRef} material={sunMaterial}>
        <sphereGeometry args={[1.35, 64, 48]} />
      </mesh>
      <sprite ref={haloRef} scale={[5.5, 5.5, 1]}>
        <spriteMaterial
          map={haloTexture}
          color="#ffb45e"
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <pointLight color="#ffe9b8" intensity={300} distance={0} decay={2} />
    </group>
  );
}
