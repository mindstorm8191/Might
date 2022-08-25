<?php /*
    autologin.php
    Handles users logging in on page load
    For the game Might
*/

require_once("config.php");
require_once("common.php");

// Start with collecting the actual message
require_once("getInput.php");    // This will now have the full content in $msg

// Verify the input that was provided
$con = verifyInput($msg, [
    ['name'=>'userid', 'required'=>true, 'format'=>'int'],
    ['name'=>'ajaxcode', 'required'=>true, 'format'=>'int']
], 'server/autologin.php');

// We need the player data anyway, so get the player info and verify the input is valid
// Also, check that the user has logged in within the last 24 hours
$res = DanDBList("SELECT * FROM player WHERE id=? AND ajaxcode=? AND ipaddress=?;", 'iis',
                 [$con['userid'], $con['ajaxcode'], $_SERVER['REMOTE_ADDR']], 'server/autologin.php->verify user input');
if(sizeof($res)===0) ajaxreject('invaliduser', 'Sorry, that user does not exist');
$player = $res[0];

// We could check if the player has logged in within 24 hours... but this is a single player game, we can relax on this requirement

// Determine if this is an admin user. We will have a different response to the user's request if it is
// Remember: a user cannot become an admin directly. This is a mode set manually in the database
if($player['usertype']===1) {
    // Upon login, we need to provide a list of all maps. We'll provide additional data with it as we can
    die(json_encode([
        'result'=>'success',
        'userid'=>$player['id'],
        'username'=>$player['name'],
        'usertype'=>'admin',
        'ajaxcode'=>$player['ajaxcode'],
        'maplist'=>DanDBList("SELECT id,name,tilestall,tileswide FROM gamemap;", '', [], 'server/login.php->get maps for admin')
        // Well... we don't need ALL the map data; it'll probably be a lot. Just get the important parts
    ]));
}

// Now we're ready to reply to this request
die(json_encode([
    'result'  =>'success',
    'userid'  =>$player['id'],
    'usertype'=>'player',
    'username'=>$player['name'],
    'ajaxcode'=>$player['ajaxcode'],
]));
        