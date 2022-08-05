/*
        Might
    A dark Tower Defense game, taking concepts from GemCraft


    Task List
1) Make sure we can display the existing tower mesh we have, within the app
2) Make some tile art, so we have something to create levels from
3) Get tiles to display in the game
4) Have tiles denote paths that monsters can travel on. Use A* (or something) to build a valid path to the orb

*/

import React from "react";
import * as Three from "three";
import { Canvas, useThree, useFrame, useLoader } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";

function App() {
    return (
        <div id="canvas-container">
            <Canvas style={{ height: "100vh", backgroundColor: "black" }}>
                <spotLight intensity={0.6} position={[30, 30, 50]} angle={0.2} penumbra={0.5} castShadow />
                <mesh>
                    <boxBufferGeometry />
                    <meshPhongMaterial color="red" />
                </mesh>
            </Canvas>
        </div>
    );
}

export default App;
