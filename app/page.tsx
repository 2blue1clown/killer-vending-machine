"use client"
import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import Experience from "./_components/_three/Experience";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Killer Vending Machine</h1>
      <KeyboardControls map={ [
    {name:"change",keys:["Space"]},
  ] }>
    <Canvas
      shadows
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-40, 40, 48],
      }}
    >
      <Experience />
    </Canvas>,
  </KeyboardControls>
  </main>
  );
}
