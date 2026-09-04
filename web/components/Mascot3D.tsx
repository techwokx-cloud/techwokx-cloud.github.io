"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

function RobotModel({ waving }: { waving: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/mascot3d/robot-mascot.glb");
  const t = useRef(0);
  const waveT = useRef(0);

  // Base vertical offset centers the model in frame. Biased to favor the
  // upper body/head (roughly waist-up) rather than full body, both because
  // the head is what makes it recognizable and because "waist-up, closer"
  // reads as a bigger, more present mascot than a small full-body figure.
  const BASE_Y = -1.7;

  useFrame((_, delta) => {
    if (!group.current) return;
    t.current += delta;

    const bob = Math.sin(t.current * 1.2) * 0.08;
    const idleRotation = Math.sin(t.current * 0.6) * 0.35;

    if (waving) {
      waveT.current += delta;
      const waveRotation = Math.sin(waveT.current * 9) * 0.5;
      group.current.rotation.y = idleRotation + waveRotation;
      group.current.rotation.z = Math.sin(waveT.current * 9) * 0.12;
      group.current.position.y =
        BASE_Y + bob + Math.abs(Math.sin(waveT.current * 9)) * 0.06;
    } else {
      waveT.current = 0;
      group.current.rotation.y = idleRotation;
      group.current.rotation.z = 0;
      group.current.position.y = BASE_Y + bob;
    }
  });

  return (
    <group ref={group} scale={1.15} position={[0, BASE_Y, 0]}>
      <primitive object={scene} />
    </group>
  );
}

export default function Mascot3D({ waving }: { waving: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.8], fov: 32 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 3, 4]} intensity={1.4} />
      <directionalLight position={[-2, -1, -2]} intensity={0.4} />
      <RobotModel waving={waving} />
      <Environment preset="city" />
    </Canvas>
  );
}

useGLTF.preload("/mascot3d/robot-mascot.glb");
