"use client"
import { OrbitControls, useAnimations, useGLTF, useKeyboardControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import {  useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, Group, Mesh, MeshBasicMaterial, Object3DEventMap } from "three";
import VendingMachine  from "./VendingMachine";
import  OfficeWorker  from "./OfficeWorker";
import BloodBurst from "./BloodBurst/BloodBurst";

const VENDING_MACHINE_WIDTH = 3.6;
const MARGIN_FOR_ERROR = 0.17;

export enum GameStatus {
  PREGAME,
  PLAYING,
  PAUSED,
  GAMEOVER
}

interface ExperienceProps{
  score:number,
  setScore: (score:number) => void
  gameStatus:GameStatus,
  setGameStatus: (gameStatus:GameStatus) => void
}



export default function Experience({score,setScore,gameStatus,setGameStatus}:ExperienceProps) {
  const vendingMachineRef = useRef<Group>(null)
  const boundaryRef = useRef<Group>(null)
  const officeWorkerRef = useRef<Group>(null)
  const boundaryPlaneRef = useRef<Mesh>(null)
  const [subscribeKeys, getKeys] = useKeyboardControls()

  const [change,setChange] = useState(false)
  const [spaceBarDown,setSpaceBarDown] = useState(false)



  const [speed,setSpeed]= useState(1)

  function startGame(){
    console.log("starting game")
    moveBoundry(Math.PI/6)
   

  }

  function reset(){
    // setVendingMachineRotation(0)
    setScore(0);
    (boundaryPlaneRef.current?.material as MeshBasicMaterial).color.set("blue")
    moveBoundry(0)
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

  function setVendingMachineRotation(rotation:number){
    if(!vendingMachineRef.current) return
    vendingMachineRef.current.rotation.x = rotation
  }
    

  function moveMachine(delta:number){

    if(!vendingMachineRef.current) return

    const vendingMachineGroup = vendingMachineRef.current as Group<Object3DEventMap>
    const vendingMachineMesh = vendingMachineGroup.children[0]
    const officeWorkerGroup = officeWorkerRef.current as Group<Object3DEventMap>

    let tip = vendingMachineGroup.rotation.x

    if(gameStatus === GameStatus.PLAYING || gameStatus === GameStatus.GAMEOVER){
        tip = vendingMachineGroup.rotation.x + getDirection()*(delta*(0.5+0.1*score+Math.pow(vendingMachineGroup.rotation.x,2)*0.2));

    }
    if(gameStatus === GameStatus.PREGAME && tip !== 0){
      tip = tip + -Math.sign(tip)*0.01
      if(tip < 0.01 && tip > -0.01){
        tip = 0
      }

    }

    if(Math.abs(tip) > Math.PI/2){
      tip = Math.sign(tip) * Math.PI/2;
    }

    const officeWorkerScale = Math.max(Math.min(0.5,0.5* (1 - (tip - 0.6/(Math.PI/2)))),0.001)
    officeWorkerGroup.scale.y = officeWorkerScale
    

    if(gameStatus!== GameStatus.GAMEOVER && hitBoundary()){
      console.log("hit boundary")
      gameOver()
    }
 


    setVendingMachineRotation(tip)

    //Make  it so that the machine pivots on its corner instead of center
    vendingMachineGroup.position.z = Math.sign(tip) * VENDING_MACHINE_WIDTH/2
    vendingMachineMesh.position.z =  -Math.sign(tip) * VENDING_MACHINE_WIDTH/2

  }

  useEffect(() => {
    

    if(gameStatus === GameStatus.PLAYING){
      console.log('playing')
      startGame()
    }
    if(gameStatus === GameStatus.PREGAME){
      console.log('pregame')
      reset()
    }
  
    window.addEventListener('click',changeFromClick)
    return () => {
      window.removeEventListener('click',changeFromClick)
    }
  },[gameStatus])

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
       <Perf position="bottom-right" /> 
      <OrbitControls makeDefault />
      <directionalLight castShadow position={[1, 2, 3]} intensity={3} />
      <ambientLight intensity={0.8} />
      <group position={[0,0,-4]}>
      <VendingMachine
        onClick={changeFromClick}
        scale={1}
        ref={vendingMachineRef}
        castShadow
      ></VendingMachine>
      <OfficeWorker ref={officeWorkerRef} position={[0,0,8]} rotation={[0,Math.PI,0]} scale={0.5}/>
      
    <group ref={boundaryRef} rotation={[0,0,0]} position={[0,0,0]} > 
        <mesh ref={boundaryPlaneRef} position={[0,10,0]}>
          <planeGeometry args={[10 , 20]} />
          <meshBasicMaterial color={0x0000ff} transparent={true} opacity={gameStatus === GameStatus.PREGAME? 0 : 0.2} side={DoubleSide}/>
        </mesh>
      </group>

        <BloodBurst active={gameStatus === GameStatus.GAMEOVER && getDirection() == 1} scale={5} position={[0,0,8]}/>
        
        </group>
        <mesh position={[0,-0.25,0]}>
          <cylinderGeometry args={[15,15,0.5,32]}/>
          <meshStandardMaterial color="silver" side={DoubleSide}/>
        </mesh>
    </>
  );
}
