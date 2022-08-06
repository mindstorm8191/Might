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
                <GemTower position={[0, -4, -7]} rotation={[Math.PI / 2, 0, 0]} />
                <GroundTile />
            </Canvas>
        </div>
    );
}

function GroundTile(props) {
    const texture = useLoader(TextureLoader, "http://localhost/Might/getmedia.php?file=whitestoneblocks.png");

    return (
        <React.Suspense fallback={null}>
            <mesh>
                <planeBufferGeometry />
                <meshStandardMaterial map={texture} />
            </mesh>
        </React.Suspense>
    );
}

function GemTower(props) {
    const { nodes, materials } = useGLTF("http://localhost/Might/getmedia.php?file=GemTower.gltf");
    const textures = useLoader(TextureLoader, [
        "http://localhost/Might/getmedia.php?file=glitter.png",
        "http://localhost/Might/getmedia.php?file=whitestoneblocks.png",
    ]);

    return (
        <React.Suspense fallback={null}>
            <mesh geometry={nodes.TowerBase.geometry} {...props}>
                <meshStandardMaterial map={textures[1]} />

                <mesh geometry={nodes.TowerSide.geometry}>
                    <meshStandardMaterial map={textures[0]} />
                </mesh>
                <mesh geometry={nodes.TowerTop.geometry}>
                    <meshStandardMaterial map={textures[0]} />
                </mesh>
            </mesh>
        </React.Suspense>
    );
}

export default App;
