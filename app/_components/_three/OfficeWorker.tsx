import { useGLTF } from "@react-three/drei"
import { GroupProps } from "@react-three/fiber"
import { Ref, forwardRef } from "react"
import { Group, Object3DEventMap } from "three"



export const OfficeWorker = forwardRef((props:GroupProps,ref: Ref<Group<Object3DEventMap>> | undefined) => {

    const fatman = useGLTF('./office-worker.glb')
    
    return (
        <group ref={ref} {...props}>
                  <primitive position={[0,17.1,0]} object={fatman.scene}/>
        </group>
    )
})