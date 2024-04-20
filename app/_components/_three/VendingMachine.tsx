"use client"
import { useAnimations, useGLTF } from "@react-three/drei";
import React, { Ref, forwardRef, useEffect } from "react";
import { Group, LoopOnce, Object3DEventMap } from "three";


interface VendingMachineProps {
  position?: [number, number, number];
  scale: number;
  onClick?: (e: any) => void;
}



export const VendingMachine = forwardRef(
  ({ scale,onClick, position = [0, 0, 0] }: VendingMachineProps, ref) => {
    
    const vendingMachine = useGLTF("./vending-machine.glb");
    const { actions, names } = useAnimations(
      vendingMachine.animations,
      vendingMachine.scene,
    );



    return (
      <group
        ref={ref as Ref<Group<Object3DEventMap>>}
        scale={scale}
      >
        <mesh position={[0, 0,0]}>
          <sphereGeometry args={[0.25]} />
          <meshBasicMaterial color="orange" wireframe={true} />
        </mesh>
        <primitive
          object={vendingMachine.scene}
          onClick={onClick}
        />
      </group>
    );
  },
);
