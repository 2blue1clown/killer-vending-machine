"use client"
import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import Experience from "./_components/_three/Experience";

export default function Home() {
  return (
    <main>
      <KeyboardControls map={ [
    {name:"change",keys:["Space"]},
  ] }>
    <h1>Killer Vending Machine</h1>
    <h1>Killer Vending Machine</h1>
    <h1>Killer Vending Machine</h1>
    <h1>Killer Vending Machine</h1>
    <h1>Killer Vending Machine</h1>
    <h1>Killer Vending Machine</h1>
    <h1>Killer Vending Machine</h1>
    <h1>Killer Vending Machine</h1>
    <h1>Killer Vending Machine</h1>
    <h1>Killer Vending Machine</h1>
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
