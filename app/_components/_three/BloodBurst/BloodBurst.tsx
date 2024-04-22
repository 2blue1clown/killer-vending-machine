import { GroupProps, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { BufferGeometry, DoubleSide, NormalBufferAttributes, ShaderMaterial } from "three";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";



interface BloodBurstProps extends GroupProps{
    active:boolean
    particleCount?:number
    color?:string
    animationDuration?:number
    radius?:number
}

export default function BloodBurst({active,...props}:BloodBurstProps){

    const geometryRef = useRef<BufferGeometry<NormalBufferAttributes>>(null)
    const materialRef = useRef<ShaderMaterial>(null)

    const verticiesCount = 1000*3
    const positions = useMemo(() => {
        const positions = new Float32Array(verticiesCount* 3)
        for(let i = 0; i < verticiesCount*3; i++){
            positions[i] = (Math.random()-0.5)*3
        }
        return positions
    }, [])

    useEffect(() => {
        // geometryRef.current?.computeVertexNormals()
        console.log('active',active)
        if(active){
            
        }
    },[active])
    

    useFrame(({clock}) => {
        if(!active) {
            clock.start()
            return
        }
        if(!materialRef.current) return
        const elapsedTime = clock.getElapsedTime()
    
        console.log(elapsedTime)
        materialRef.current.uniforms.uTime.value = elapsedTime
    }
    )

    return (<>
    {active && 
        <group {...props} scale={[2,7,2]}>
        <points position={[0,0,0]}>
            <bufferGeometry ref={geometryRef}>
                <bufferAttribute attach={"attributes-position"} count={verticiesCount} array={positions} itemSize={3} />
            </bufferGeometry>
            {/* <meshStandardMaterial color="red" side={DoubleSide} /> */}
            <shaderMaterial 
            transparent={true}
            ref={materialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={{
                uTime:{value:0}
            }}
            />
        </points>
        </group>
}
    </>
        
    );
}