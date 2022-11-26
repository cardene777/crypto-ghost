import React,{ useState, useContext } from "react";
import { Canvas, useFrame, useLoader } from '@react-three/fiber';

function Three() {

    // function Scene(objData: string) {
    //     const obj = useLoader(OBJLoader, objData)
    //     return <primitive object={obj} />
    // }

    // Animation
    const objAnimation: any = React.useRef();

    useFrame(({ clock }) => {
        const animation = clock.getElapsedTime();
        objAnimation.current.rotation.y = animation;
    });

    return (
        <mesh ref={objAnimation}>
        {/* { Scene(objData[0]) } */}
        <meshStandardMaterial color="red"/>
        </mesh>
    );

}

export default Three;
