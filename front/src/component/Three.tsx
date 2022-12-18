import React,{ useState, useContext } from "react";
import { Canvas, useFrame, useLoader } from '@react-three/fiber';

import { OBJLoader } from "../hooks/OBJLoader";
import { DataContext } from '../App';

function Three() {

    const { connectWallet, currentAccount, setCurrentAccount, objItem } = useContext(DataContext);


    function Scene(objData: string) {
        const obj = useLoader(OBJLoader, objData)
        return <primitive object={obj} scale={2.5}/>
    }

    // Animation
    const objAnimation: any = React.useRef();

    useFrame(({ clock }) => {
        const animation = clock.getElapsedTime();
        objAnimation.current.rotation.y = animation;
    });

    return (
        <mesh ref={objAnimation} visible>
            { Scene(objItem) }
            <meshStandardMaterial color="hotpink"/>
        </mesh>
    );

}

export default Three;
