import { useGLTF } from "@react-three/drei"
import { GroupProps } from "@react-three/fiber"
import { Ref, forwardRef } from "react"
import { Group, Object3DEventMap } from "three"



export const FatMan = forwardRef((props:GroupProps,ref: Ref<Group<Object3DEventMap>> | undefined) => {

    const fatman = useGLTF('./fat-man.glb')
    
    return (
        <group ref={ref} {...props}>
                  <primitive object={fatman.scene}/>
        </group>
    )
})