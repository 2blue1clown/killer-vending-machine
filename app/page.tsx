"use client"
import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import Experience from "./_components/_three/Experience";
import { useState } from "react";

export enum GameStatus {
  PREGAME,
  PLAYING,
  PAUSED,
  GAMEOVER
}

export default function Home() {

  const [score,setScore] = useState(0)
  const [gameStatus,setGameStatus] = useState<GameStatus>(GameStatus.PREGAME)

  const startGame = () => {
    console.log("Starting game")
    setGameStatus(GameStatus.PLAYING)
  }

  return (
    <main>
      <KeyboardControls map={ [
    {name:"change",keys:["Space"]},
  ] }>
    <Canvas
      shadows
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-60, 60, 48],
      }}
    >
      <Experience score={score} setScore={setScore} gameStatus={gameStatus} setGameStatus={setGameStatus} />
    </Canvas>,
  </KeyboardControls>
  <div className="flex flex-col p-10 items-center  absolute top-0 left-0"> 
      {gameStatus === GameStatus.PREGAME && <h1>Killer Vending Machine</h1>}
      
      {(gameStatus === GameStatus.PLAYING || gameStatus === GameStatus.GAMEOVER)&& <div>{score}</div>}
      {gameStatus === GameStatus.PREGAME &&
      <button onClick={startGame}>Play</button>
}
    </div>
  </main>
  );
}
