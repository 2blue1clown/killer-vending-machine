"use client"
import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Experience, { GameStatus } from "./_components/_three/Experience";
import { useEffect, useState } from "react";
import Leaderboard from "./_components/Leaderboard";
import { Scores } from "./api/leaderboard/route";
import SaveScore from "./_components/_three/SaveScore";



export default function Home() {

  const [score,setScore] = useState(0)
  const [scores,setScores] = useState<Scores[]>([])
  const [gameStatus,setGameStatus] = useState<GameStatus>(GameStatus.PREGAME)

  useEffect(() => {
    (async () => {const res = await fetch('/api/leaderboard',{method:'GET'})     
    const scores = await res.json()
    setScores(scores)
})()},[])


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
      {gameStatus === GameStatus.PREGAME && <h1 className="text-xl"><strong>Killer Vending Machine</strong></h1>}
      {(gameStatus === GameStatus.PLAYING || gameStatus === GameStatus.GAMEOVER)&& <div className="text-xl">{score}</div>}
      {gameStatus === GameStatus.PREGAME &&<button className="border p-1 hover:bg-white" onClick={startGame}>Play</button>}
      {gameStatus === GameStatus.GAMEOVER && score === 0 && <div className="border border-dashed m-2"><div>Tip!</div>
      <div className="w-64" >Stop the vending machine from reaching the boundary by pressing space or tapping the screen!</div></div>}
      {gameStatus === GameStatus.GAMEOVER && 
        <>
        <button className="border p-1 hover:bg-white" onClick={()=>setGameStatus(GameStatus.PREGAME)}>Play Again</button>
        <br></br>
        <h2>High Scores</h2>
        <div className="h-72 overflow-scroll flex flex-col items-center border border-black">
        <Leaderboard scores={scores}></Leaderboard>
        </div>
        <br></br>
        <SaveScore scores={scores} setScores={setScores} score={score}></SaveScore>
 
        </>}
     
    </div>
  </main>
  );
}
