"use client"
import { OrbitControls, useAnimations, useGLTF, useKeyboardControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import {  useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, Group, Mesh, MeshBasicMaterial, Object3DEventMap } from "three";
import { VendingMachine } from "./VendingMachine";
import { GameStatus } from "@/app/page";
import { FatMan } from "./FatMan";

const VENDING_MACHINE_WIDTH = 3.6;
const MARGIN_FOR_ERROR = 0.1;

interface ExperienceProps{
  score:number,
  setScore: (score:number) => void
  gameStatus:GameStatus,
  setGameStatus: (gameStatus:GameStatus) => void
}

export default function Experience({score,setScore,gameStatus,setGameStatus}:ExperienceProps) {
  const vendingMachineRef = useRef<Group>(null)
  const boundaryRef = useRef<Group>(null)
  const fatmanRef = useRef<Group>(null)
  const boundaryPlaneRef = useRef<Mesh>(null)
  const [subscribeKeys, getKeys] = useKeyboardControls()

  const [change,setChange] = useState(false)
  const [spaceBarDown,setSpaceBarDown] = useState(false)


  const [speed,setSpeed]= useState(1)

  useEffect(() => {
    if(gameStatus === GameStatus.PLAYING){
      console.log('playing')
      moveBoundry(Math.PI/6)

    }
  },[gameStatus])


  function changingFromSpaceBar(){
      if(gameStatus !== GameStatus.PLAYING) return
      if(!spaceBarDown && getKeys().change) {
        setSpaceBarDown(true)
        setChange(true)
        return
      }
      else if(spaceBarDown && getKeys().change)return
      else if(spaceBarDown && !getKeys().change){
        setSpaceBarDown(false)
      } 

    }

  function getDirection(){
    return Math.sign(boundaryRef.current?.rotation.x??0);
  }

  function gameOver(){
    (boundaryPlaneRef.current?.material as MeshBasicMaterial).color.set("red")
    setGameStatus(GameStatus.GAMEOVER)
  }

  function changeFromClick(){
    console.log("click")
      if(gameStatus !== GameStatus.PLAYING) return
      if(!change){setChange(true)}
    }

  function hitBoundary(){
    if(!boundaryRef.current || !vendingMachineRef.current) return false
    if(getDirection() > 0){
      return vendingMachineRef.current.rotation.x > boundaryRef.current.rotation.x + MARGIN_FOR_ERROR
    }
    else{
      return vendingMachineRef.current.rotation.x < boundaryRef.current.rotation.x - MARGIN_FOR_ERROR
    }
  }

  function isInMarginOfError(){
    if(!boundaryRef.current || !vendingMachineRef.current) return false
    return Math.abs(vendingMachineRef.current.rotation.x - boundaryRef.current.rotation.x) < MARGIN_FOR_ERROR
  }

  function chooseNewSpeed(){
    setSpeed(Math.random()*0.5+score*0.1)
  }

  function moveBoundry(rotation?:number){
    if(!boundaryRef.current) return
    if(rotation){
      boundaryRef.current.rotation.x = rotation
      boundaryRef.current.position.z = getDirection()*VENDING_MACHINE_WIDTH/2;
      return
    }
    boundaryRef.current.rotation.x = -getDirection()*Math.random()*Math.PI/2
    boundaryRef.current.position.z = getDirection()*VENDING_MACHINE_WIDTH/2;
  }

  function moveMachine(delta:number){

    if(!vendingMachineRef.current) return
    if(gameStatus !== GameStatus.PLAYING && gameStatus !== GameStatus.GAMEOVER) return

    const vendingMachineGroup = vendingMachineRef.current as Group<Object3DEventMap>
    const vendingMachineMesh = vendingMachineGroup.children[1]
    const fatmanGroup = fatmanRef.current as Group<Object3DEventMap>


    let tip = vendingMachineGroup.rotation.x + speed*delta*getDirection();


    
    if(Math.abs(tip) > Math.PI/2){
      tip = Math.sign(tip) * Math.PI/2;
    }

    const fatmanScale = Math.min(1.5,1.5* (1 - tip/(Math.PI/2)))
    fatmanGroup.scale.y = fatmanScale

    if(gameStatus!== GameStatus.GAMEOVER && hitBoundary()){
      console.log("hit boundary")
      gameOver()
    }

    vendingMachineGroup.rotation.x = tip;

    //Make  it so that the machine pivots on its corner instead of center
    vendingMachineGroup.position.z = Math.sign(tip) * VENDING_MACHINE_WIDTH/2
    vendingMachineMesh.position.z =  -Math.sign(tip) * VENDING_MACHINE_WIDTH/2

  }

  useFrame(({clock},delta) => {
   
    changingFromSpaceBar()
    if(change){
      console.log("changing")
      setChange(false)
      

      if(!isInMarginOfError()){
        console.log("not in margin of error")
        gameOver()
        return
      }

      setScore(score+1)
      chooseNewSpeed()
      moveBoundry()

    }
    moveMachine(delta)

    
  });

  return (
    <>
      {/* <Perf position="top-left" /> */}

      <OrbitControls makeDefault />
      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />
      <VendingMachine
        onClick={changeFromClick}
        scale={1}
        ref={vendingMachineRef}
      ></VendingMachine>
      <FatMan ref={fatmanRef} position={[0,0,8]} scale={[1.5,1.5,1.5]}/>
      
    <group ref={boundaryRef} rotation={[0,0,0]} position={[0,0,0]} > 
        <mesh ref={boundaryPlaneRef} position={[0,10,0]}>
          <planeGeometry args={[10 , 20]} />
          <meshBasicMaterial color={0x0000ff} transparent={true} opacity={gameStatus === GameStatus.PREGAME? 0 : 0.2} side={DoubleSide}/>
        </mesh>
        <mesh>
          <sphereGeometry args={[0.1]}/>
          <meshBasicMaterial color="orange" wireframe={true} />
        </mesh>
      </group>


        <mesh>
          <sphereGeometry args={[0.1]}/>
          <meshBasicMaterial color="red" wireframe={true} />
        </mesh>
        <mesh rotation={[Math.PI/2,0,0]}>
          <planeGeometry args={[40, 40]} />
          <meshBasicMaterial color="lightgrey" opacity={0.6} side={DoubleSide}/>
        </mesh>
    </>
  );
}
