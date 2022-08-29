/*  Admin.jsx
    Handles React components and other things related to Admin operations
    For the game Might
*/

import React from "react";
import "./App.css";
import { DAX } from "./DanAjax.js";
import { DanInput } from "./DanInput.jsx";

import { serverURL, GemTower, GroundTile } from "./App.js";
import { HeaderBar } from "./account.jsx";

import * as Three from "three";
import { useGLTF } from "@react-three/drei";
import { Canvas, useThree, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";


export function AdminMapList(props) {
    // Displays a list of all maps in the game
    // prop fields - data
    //      mapList - list of all maps this game has
    // prop fields - functions
    //      updateMapList - called when a new map is created. Passes the updated full map list
    //      selectMap - selects a map to display

    const [newName, setNewName] = React.useState("");

    function nameUpdate(field, value) {
        setNewName(value);
    }

    function createMap() {
        // Now, we collect the new map name and have the server make a new map
        if (newName === "") {
            console.log("Error - map must have a name");
            return;
        }
        fetch(serverURL + "admin.php", DAX.serverMessage({ action: "CreateMap", mapname: newName }, true))
            .then((res) => DAX.manageResponseConversion(res))
            .catch((err) => console.log("server error", err))
            .then((data) => {
                if (data.result !== "success") {
                    console.log("Server responded with error:", data);
                    return;
                }

                // when map creation is successful, we want to add the map to our list, then start editing it
                let list = props.mapList;
                list.push({ name: newName, iconx: 0, icony: 0, tilestall: 10, tileswide: 10, tiles: [], waves: [] });
                props.updateMapList(list);

                // We also want to open that map for editing
                props.selectMap(list.length - 1);
                setNewName("");
            });
    }

    return (
        <>
            <HeaderBar userData={props.userData} />
            <p>Hello admin!</p>
            {props.mapList.map((val, key) => (
                <p className="fakelink singleline" key={key} onClick={()=>props.selectMap(props.mapList.findIndex(e=>e.name===val.name))}>
                    {val.name}
                </p>
            ))}

            {/*Now, allow new maps to be made */}
            <p style={{ fontWeight: "bold" }}>Create new map</p>
            <DanInput placeholder="Map Name" onUpdate={nameUpdate} fileName="" onEnter={createMap} />
            <input type="button" value="Create & Open" onClick={createMap} />
        </>
    );
}


export function AdminMapEdit(props) {
    // Provides an actual editor for our maps
    // props - data
    //     userData - data structure received from the server, holding all user information
    //     sel - which map of the map pack is selected for editing
    //     mapList - all maps and loaded data
    // props - functions
    //     updateMapTiles - applies new content for the tiles of this map
    //     updateMapWaves - applies new content for the waves of this map

    React.useEffect(() => {
        // As this component is loaded, we want to ensure that our map has also been loaded; the initial user login will only have top-level
        // map data
        if(typeof(props.mapList[props.sel].tiles)==='undefined' || props.mapList[props.sel].tiles.length===0) {
            fetch(serverURL + "admin.php", DAX.serverMessage({ action: "GetMapDetail", mapname: props.mapList[props.sel].name }, true))
                .then((res) => DAX.manageResponseConversion(res))
                .catch((err) => console.log("server error", err))
                .then((data) => {
                    // Sanitise and validate the input
                    if(typeof(data.result)!=='string') {
                        console.log('Bad data from server; no result');
                        return;
                    }
                    if(data.result!=='success') {
                        console.log('Server gave error when fetching map:', data);
                        return;
                    }
                    if(typeof(data.tiles)==='undefined') {
                        console.log('Bad data from server; no tiles');
                        return;
                    }
                    if(typeof(data.waves)==='undefined') {
                        console.log('Bad data from server; no waves');
                        return;
                    }

                    // Now for more serious checks
                    if(data.tiles.length===0) {
                        // This map currently has no tiles. Generate some mock content to fill in our map
                        for(let my=0; my<props.mapList[props.sel].tilestall; my++) {
                            for(let mx=0; mx<props.mapList[props.sel].tileswide; mx++) {
                                data.tiles.push({
                                    x:mx,
                                    y:my,
                                    tile: 'greenStraight',
                                    rot:0
                                });
                            }
                        }
                    }
                    if(data.waves.length===0) {
                        // This map doesn't have any waves. Let's add a basic starter one
                        data.waves = {
                            monster: 'normal',
                            count: 10,
                            spawnStyle: 'orderly',  // style in which monsters spawn. Orderly denotes units released at even intervals over the full wave period
                            hitpoints: 20,
                            speed: 1,  // tiles traveled per second
                            timeTillNext: 30, // seconds until next wave begins
                        }
                    }

                    // Now that we have guaranteed content, let's apply it directly to the map record
                    props.updateMapTiles(props.mapList[props.sel].name, data.tiles);
                    props.updateMapWaves(props.mapList[props.sel].name, data.waves);
                });
        }
    },[]);

    const [cursorPos, setCursorPos] = React.useState({x:0, y:0});

    return (
        <>
            <HeaderBar userData={props.userData} />
            <Canvas style={{ height: "calc(100vh - 150px)", backgroundColor: "black" }} camera={{ position: [0, 0, 12] }}>
                <ambientLight intensity={0.25} />
                {typeof(props.mapList[props.sel].tiles)!=='object'?'':props.mapList[props.sel].tiles.map((tile,key) => (
                    <GroundTile key={key} tile={tile} xpos={-5} ypos={-5} onClick={()=>setCursorPos({x:tile.x, y:tile.y})} />
                ))}
                <BlockCursor position={[cursorPos.x-5, cursorPos.y-5, 0]} />
            </Canvas>
        </>
    );
}

function BlockCursor(props) {
    const { nodes, materials } = useGLTF("http://localhost/Might/getmedia.php?file=BlockCursor.gltf");
    return (
        <React.Suspense fallback={null}>
            <mesh geometry={nodes.Cube.geometry} {...props} scale={0.5} rotation={[Math.PI/2,0,0]}>
                <meshPhongMaterial color={"blue"} />
            </mesh>
        </React.Suspense>
    );
}
