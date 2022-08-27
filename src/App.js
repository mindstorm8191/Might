/*
        Might
    A dark Tower Defense game, taking concepts from GemCraft


    Task List

4) Create a maps list, and ways to create a new map
5) 
*/

import React from "react";
import "./App.css";
import * as Three from "three";
import { Canvas, useThree, useFrame, useLoader } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";

import { DAX } from "./DanAjax.js";

import { AdminMapList, AdminMapEdit } from "./admin.jsx";
import { RegisterForm, HeaderBar } from "./account.jsx";

export const tileSet = [
    { name: "greenEntrance", file: "greenPathEntrance.png" },
    { name: "greenStraight", file: "greenPathStraight.png" },
    { name: "greenTee", file: "greenPathTee.png" },
    { name: "greenTurn", file: "greenPathTurn.png" },
];

const gameMap = [
    { x: 0, y: 0, tile: "greenEntrance", rot: 0 },
    { x: 1, y: 0, tile: "greenEntrance", rot: 2 },
    { x: 2, y: 0, tile: "greenStraight", rot: 1 },
    { x: 3, y: 0, tile: "greenTee", rot: 0 },
    { x: 0, y: 1, tile: "greenEntrance", rot: 0 }, // y+ is up; so these are above the first row
    { x: 1, y: 1, tile: "greenEntrance", rot: 2 },
    { x: 2, y: 1, tile: "greenStraight", rot: 1 },
    { x: 3, y: 1, tile: "greenTurn", rot: 3 },
];

export const serverURL = process.env.NODE_ENV === "production" ? "server/" : "http://localhost:80/Might/server/";
export const imageURL = process.env.NODE_ENV === "production" ? "media/" : "http://localhost:80/Might/media/";

function App() {
    const [page, setPage] = React.useState("HomePage");
    const [userData, setUserData] = React.useState(null);
    const [adminMapList, setAdminMapList] = React.useState(null);
    const [adminMapSelected, setAdminMapSelected] = React.useState(0);

    // Startup processes. We're primarily concerned about letting existing players log in automatically
    React.useEffect(() => {
        if (typeof localStorage.getItem("userid") == "object") return; // Do nothing if no data is in localStorage

        fetch(
            serverURL + "autologin.php",
            DAX.serverMessage({ userid: localStorage.getItem("userid"), ajaxcode: localStorage.getItem("ajaxcode") }, false)
        )
            .then((res) => DAX.manageResponseConversion(res))
            .catch((err) => console.log(err))
            .then((data) => {
                if (data.result !== "success") {
                    return;
                }
                // At this point, everything is handled the same as a normal login
                onLogin(data);
            });
    }, []);

    function onLogin(pack) {
        // Handles user actions when the user logs in
        console.log(pack);
        if (pack.result === "success") {
            // Use localStorage to keep the user's ID & access code
            localStorage.setItem("userid", pack.userid);
            localStorage.setItem("ajaxcode", pack.ajaxcode);

            // Do something different for admin users
            if (pack.usertype === "admin") {
                setAdminMapList(pack.maplist);
                setUserData({ id: pack.userid, name: pack.username, ajaxcode: pack.ajaxcode });
                setPage("AdminMapList");
                return;
            }

            setPage("Overview");
            setUserData({ id: pack.userid, name: pack.username, ajaxcode: pack.ajaxcode });
            return;
        }
    }

    function AdminSelectMap(mapSlot) {
        // Changes the admin's selected map, while switching to the edit-map page

        console.log("Switch to map " + mapSlot);
        setAdminMapSelected(mapSlot);
        setPage("AdminMapEdit");
    }

    function AdminUpdateMapTiles(mapName, newTileList) {
        // Updates all tiles of a specific map
        setAdminMapList(
            adminMapList.map((single) => {
                if (single.name === mapName) {
                    single.tiles = newTileList;
                }
                return single;
            })
        );
    }
    function AdminUpdateMapWaves(mapName, newWaveList) {
        // Updates all waves of a specific map
        setAdminMapList(
            adminMapList.map((single) => {
                if (single.name === mapName) {
                    single.waves = newWaveList;
                }
                return single;
            })
        );
    }

    function pickPage() {
        switch (page) {
            case "HomePage":
                return <HomePage onLogin={onLogin} />;
            case "Overview":
                return <OverviewPage userData={userData} />;
            case "AdminMapList":
                return (
                    <AdminMapList userData={userData} mapList={adminMapList} updateMapList={setAdminMapList} selectMap={AdminSelectMap} />
                );
            case "AdminMapEdit":
                return (
                    <AdminMapEdit
                        userData={userData}
                        sel={adminMapSelected}
                        mapList={adminMapList}
                        updateMapTiles={AdminUpdateMapTiles}
                        updateMapWaves={AdminUpdateMapWaves}
                    />
                );
            default:
                return <p>Sorry, page type of "{page}" not handled</p>;
        }
    }

    return <div>{pickPage()}</div>;
}

function HomePage(props) {
    return (
        <>
            <HeaderBar onLogin={props.onLogin} />
            <p style={{ margin: 10 }}>
                Welcome to Might, a tower defense game. Dive into a dark world where monsters have overrun the world. Your king has long
                relied on his magicians to protect the castle from the hordes outside the wall. The latest attack has come with heavy
                losses, leaving the leadership of the kingdom in question. During the turmoil, you decide to trek out on your own, and see
                if you can find what is controlling these creatures. But the outside world is fraught with dangers...
            </p>
            <RegisterForm onLogin={props.onLogin} />
        </>
    );
}

function OverviewPage(props) {
    return (
        <>
            <HeaderBar userData={props.userData} />
            <p>Hello new user!</p>
        </>
    );
}

function GameScreen(props) {
    return (
        <div id="canvas-container">
            <Canvas style={{ height: "100vh", backgroundColor: "black" }} camera={{ position: [0, 0, 12] }}>
                {/*<pointLight intensity={0.6} position={[0, 0, 3]} angle={0.2} penumbra={0.5} castShadow distance={5} />*/}
                <ambientLight intensity={0.25} />
                <GemTower position={[-1, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]} scale={0.5} />
                {gameMap.map((tile, key) => (
                    <GroundTile key={key} tile={tile} />
                ))}
            </Canvas>
        </div>
    );
}

function GroundTile(props) {
    const texture = useLoader(
        TextureLoader,
        "http://localhost/Might/getmedia.php?file=" + tileSet.find((e) => e.name === props.tile.tile).file
    );

    return (
        <React.Suspense fallback={null}>
            <mesh {...props} position={[props.tile.x, props.tile.y, 0]} rotation={[0, 0, (props.tile.rot * Math.PI) / 2]}>
                <planeBufferGeometry />
                <meshLambertMaterial map={texture} />
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
            <mesh geometry={nodes.TowerBase.geometry} {...props} receiveShadow>
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
