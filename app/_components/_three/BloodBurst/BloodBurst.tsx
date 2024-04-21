import { GroupProps, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { BufferGeometry, DoubleSide, NormalBufferAttributes, ShaderMaterial } from "three";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";


export default function BloodBurst(props:GroupProps){

    const geometryRef = useRef<BufferGeometry<NormalBufferAttributes>>(null)
    const materialRef = useRef<ShaderMaterial>(null)

    const verticiesCount = 50*3
    const positions = useMemo(() => {
        const positions = new Float32Array(verticiesCount* 3)
        for(let i = 0; i < verticiesCount*3; i++){
            positions[i] = (Math.random()-0.5)*3
        }
        return positions
    }, [])

    useEffect(() => {
        geometryRef.current?.computeVertexNormals()
    },[positions])
    

    useFrame(({clock}) => {
        if(!materialRef.current) return
        const elapsedTime = clock.getElapsedTime()
        materialRef.current.uniforms.uTime.value = elapsedTime
    }
    )

    return (
        <group {...props} >
        <points position={[0,0,0]}>
            <bufferGeometry ref={geometryRef}>
                <bufferAttribute attach={"attributes-position"} count={verticiesCount} array={positions} itemSize={3} />
            </bufferGeometry>
            {/* <meshStandardMaterial color="red" side={DoubleSide} /> */}
            <shaderMaterial 
            ref={materialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={{
                uTime:{value:0}
            }}
            />
        </points>
        </group>
    );
}