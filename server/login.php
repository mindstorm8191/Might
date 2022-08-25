<?php
/*  login.php
    Allows users to log into the game
    For the game Might
*/

require_once("config.php");
require_once("common.php");
require_once('jsarray.php');

// Start with collecting the actual message from the client's request
require_once("getInput.php");

// Verify the message contents
$con = verifyInput($msg, [
    ['name'=>'username', 'required'=>true, 'format'=>'stringnotempty'],
    ['name'=>'password', 'required'=>true, 'format'=>'stringnotempty']
], 'ajax.php->action login->verify user input');

// Now, gather the user information from the database, verifying their login credentials are correct
$res = DanDBList("SELECT * FROM player WHERE name=?;", 's', [$con['username']], 'server/login.php->get player data');
if(sizeof($res)===0) {
    // There was no player data found
    ajaxreject('invaliduser', 'Sorry, that user name doesn\'t exist. Please try again');
}
$player = $res[0];
if($player['password']!=$con['password']) {
    // The password provided doesn't match
    ajaxreject('invaliduser', 'Sorry, that password doesn\'t match. Please try again');
}
$playerid = $player['id'];

// Generate a new ajax code. We will need to save it to the database, along with sending it to the user. Update a few other fields while we're here
srand(time());
$ajaxcode = rand(0, pow(2, 31));
DanDBList("UPDATE player SET ipaddress=?, ajaxcode=?, lastlogin=NOW() WHERE id=?;", 'sii',
          [$_SERVER['REMOTE_ADDR'], $ajaxcode, $player['id']], 'routes/login.php->update player at login');

// Determine if this is an admin user. We will have a different response to the user's request if it is
// Remember: a user cannot become an admin directly. This is a mode set manually in the database
if($player['usertype']===1) {
    // Upon login, we need to provide a list of all maps. We'll provide additional data with it as we can
    die(json_encode([
        'result'=>'success',
        'userid'=>$playerid,
        'username'=>$con['username'],
        'usertype'=>'admin',
        'ajaxcode'=>$ajaxcode,
        'maplist'=>DanDBList("SELECT id,name,tilestall,tileswide FROM gamemap;", '', [], 'server/login.php->get maps for admin')
    ]));
}

die(json_encode([
    'result'  =>'success',
    'userid'  =>$playerid,
    'usertype'=>'player',
    'username'=>$con['username'],
    'ajaxcode'=>$ajaxcode,
]));
        