/*
        Might
    A dark Tower Defense game, taking concepts from GemCraft


    Task List
1) Get the login section to work
2) Set up users to store the ajax code, and log in automatically when the page loads
4) Create a maps list, and ways to create a new map
5) 
*/

import React from "react";
import * as Three from "three";
import { Canvas, useThree, useFrame, useLoader } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";

import { DAX } from "./DanAjax.js";
import { DanCommon } from "./DanCommon.js";
import { DanInput } from "./DanInput.jsx";
import { ErrorOverlay } from "./ErrorOverlay.jsx";

const tileSet = [
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

    function onLogin(pack) {
        // Handles user actions when the user logs in
        console.log(pack);
        if (pack.result === "success") {
            setPage("Overview");
            setUserData({ id: pack.userid, name: pack.username, ajaxcode: pack.ajaxcode });
        }
    }

    function pickPage() {
        switch (page) {
            case "HomePage":
                return <HomePage onLogin={onLogin} userData={userData} />;
            case "Overview":
                return <OverviewPage userData={userData} />;
            default:
                return <p>Sorry, page type of "{page}" not handled</p>;
        }
    }

    return <div>{pickPage()}</div>;
}

function HeaderBar(props) {
    // Provides a header bar. We're using this here so we can show or hide it as needed; we won't need it during a battle
    // prop fields - data
    //      userData - information about the logged in user. When logged in, we will merely show a username and a logout button. Null represents
    //          a user not logged in
    // prop fields - functions
    //      onLogin - handles actions when a user logs into the game
    //      onLogout - handles actions when a user logs out of the game

    const [fields, setFields] = React.useState({ username: "", password: "" });
    const [userError, setUserError] = React.useState("");

    function inputUpdate(field, value) {
        fields[field] = value;
        setFields(fields);
    }

    function handleLogin() {
        // Make sure the user has filled out some data, before sending it to the server
        if (fields.username === "") {
            setUserError("Please provide a user name & password");
            return;
        }
        if (fields.password === "") {
            setUserError("Please provide your password");
            return;
        }
        console.log("Send to server,", fields);
        fetch(serverURL + "login.php", DAX.serverMessage(fields, false))
            .then((res) => DAX.manageResponseConversion(res))
            .catch((err) => console.log(err))
            .then((data) => {
                if (data.result !== "success") {
                    console.log("Error received from server:", data);
                    setUserError("The server responded with an error state");
                    // Go ahead and clear localstorage content, so that they're logged out locally anyway
                    localStorage.removeItem("userid");
                    localStorage.removeItem("access");
                }
                props.onLogin(data);
            });
        // While we wait for a response, let's show that we're doing something
        props.setErrorText("Working...");
    }

    let displayMode = typeof props.userData === "object" ? 1 : 0;
    return (
        <div
            style={{
                height: 150,
                backgroundImage: "url(" + imageURL + "whitestoneblocks.png",
                backgroundRepeat: "repeat-x",
            }}
        >
            <div
                style={{
                    display: "inline-block",
                    position: "relative",
                    padding: 15,
                    backgroundColor: "grey",
                    fontSize: "2.5em",
                    textShadow: "black 0px 0px 15px",
                }}
            >
                Might
            </div>
            <div style={{ display: "block", position: "absolute", right: 10, top: 5, backgroundColor: "white" }}>
                {displayMode === 1 ? (
                    <p>
                        Hello user!
                        <br />
                        ...we need a logout button
                    </p>
                ) : (
                    <>
                        <form>
                            <p className="singleline">
                                <DanInput placeholder="username" onUpdate={inputUpdate} fieldName="username" />
                            </p>
                            <p className="singleline">
                                <DanInput placeholder="password" onUpdate={inputUpdate} fieldName="password" onEnter={handleLogin} />
                            </p>
                            <p className="singleline">
                                <input type="button" value="login" onClick={handleLogin} />
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
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
            <HeaderBar />
            <p>Hello new user!</p>
        </>
    );
}

function RegisterForm(props) {
    // Provides a form for users to sign up to the game
    // prop fields
    //    onLogin - What function to call when the user has successfully signed up. This will accept
    //      all the data received from the server

    const [fields, setFields] = React.useState({ username: "", password: "", pass2: "", email: "" });
    const [userError, setError] = React.useState("");
    const [serverError, setServerError] = React.useState("");
    const [showPrivacy, setShowPrivacy] = React.useState(0);

    function handleRegister() {
        // Handles starting the registration process
        //console.log("This part needs to be written. Reference RegisterForm->handleRegister");

        // Start by checking that pass 1 & 2 match
        if (fields.password !== fields.pass2) {
            setError("Your passwords don't match. We need a better error message than something going to console.log");
            return;
        }

        // Check that the username doesn't contain any weird characters
        if (DanCommon.hasAny(fields.username, ".,~`!#$%^&*()+=[]{};:\"<>?/|'\\")) {
            setError("You cannot use special characters for your username");
            return;
        }
        if (DanCommon.hasAny(fields.email, " ~`!#$%^&*()+=[]{};:\",<>?/|'\\")) {
            setError("You cannot use special characters for your email");
            return;
        }
        if (fields.username.length < 4) {
            setError("Please provide a good username, to set you apart from others");
            return;
        }
        if (fields.email.length < 5) {
            setError("Please provide a valid email address.");
            return;
        }

        // Also ensure the email address has a valid format
        if (
            fields.email.indexOf(".") === -1 || // email has a dot
            fields.email.indexOf(".") === fields.email.length - 1 || // dot is not last character
            fields.email.indexOf(".") === 0 || // dot is not first character
            fields.email.indexOf("@") === -1 || // email has a @
            fields.email.indexOf("@") === 0 || // @ is not first character
            fields.email.indexOf("@") === fields.email.length - 1 || // @ is not last character
            fields.email.indexOf("@", fields.email.indexOf("@") + 1) !== -1 || // email does not have two @'s
            fields.email.indexOf("@.") !== -1 // domain does not start with .
        ) {
            setError("Please provide a valid email address");
            return;
        }

        // Now, send data to the server.
        fetch(
            serverURL + "signup.php",
            DAX.serverMessage({ username: fields.username, password: fields.password, pass2: fields.pass2, email: fields.email }, false)
        )
            .then((res) => DAX.manageResponseConversion(res))
            .catch((err) => console.log(err))
            .then((data) => {
                if (data.result !== "success") {
                    console.log(data);
                    setServerError(data.message);
                    return;
                }
                // Send the server's response to the parent component. This will be the same content as if they had only logged in.
                props.onLogin(data);
            });
    }

    function inputUpdate(field, value) {
        // This is called whenever an input field gets updated. Handles storing the input's content within this component
        // (since it seems that accessing it on demand isn't an option)
        // field - name of the field to update
        // value - new value to store there
        fields[field] = value;
        setFields(fields);
    }

    return (
        <div style={{ margin: 10 }}>
            <div style={{ fontSize: 20 }}>Sign up today - its free</div>
            <p className="singleline">
                <DanInput placeholder="Username" onUpdate={inputUpdate} fieldName="username" />
            </p>
            <p className="singleline">
                <DanInput placeholder="Password" onUpdate={inputUpdate} fieldName="password" />
            </p>
            <p className="singleline">
                <DanInput placeholder="Pass Again" onUpdate={inputUpdate} fieldName="pass2" />
            </p>
            <p className="singleline">
                <DanInput placeholder="Email" onUpdate={inputUpdate} fieldName="email" onEnter={handleRegister} />
            </p>
            <p className="singleline">
                <input type="button" value="Sign Up" onClick={handleRegister} />
                <span
                    className="fakelink"
                    style={{ paddingLeft: 5 }}
                    onClick={() => {
                        setShowPrivacy(1 - showPrivacy);
                    }}
                >
                    Show Privacy policy
                </span>
            </p>
            {showPrivacy === 0 ? (
                ""
            ) : (
                <div style={{ border: "1px solid", maxWidth: 500, margin: 5, padding: 7 }}>
                    Privacy Policy? Well, I am collecting email addresses... these will only be used to recover accounts. In the future I
                    may use emails to provide news of updates about this game. If this policy changes in the future, I will let you know...
                    probably by email
                </div>
            )}
            {userError === "" ? (
                ""
            ) : (
                <p className="singleline" style={{ color: "red" }}>
                    {userError}
                </p>
            )}
            <ErrorOverlay content={serverError} onContinue={setServerError} />
        </div>
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
