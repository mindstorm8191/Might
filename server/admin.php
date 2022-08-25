<?php
/*  admin.php
    Manages commands received from the client, when they are admin users
    For the game Might
*/

// Start with the usual tasks
require_once("config.php");
require_once("common.php");
require_once("getInput.php");    // This will now have the full content in $msg, and set some headers for CORS

// Before we can validate the message, we need to determine what we are receiving
switch($msg['action']) {
    case 'CreateMap':
        $con = verifyInput($msg, [
            ["name"=>"userid", "required"=>true, "format"=>"posint"],
            ["name"=>"ajaxcode", "required"=>true, "format"=>"posint"],
            ["name"=>"mapname", "required"=>true, "format"=>"stringnotempty"],
        ], 'server/admin.php->case CreateMap->verify input');

        // Next, load the user and verify this is an admin; after that, user data is irrelevant
        $res = DanDBList("SELECT usertype FROM player WHERE id=? AND ajaxcode=? AND ipaddress=?;", 'iis',
                 [$con['userid'], $con['ajaxcode'], $_SERVER['REMOTE_ADDR']], 'server/admin.php->case CreateMap->verify user input');
        if(sizeof($res)===0) ajaxreject('invaliduser', 'Sorry, that user does not exist');
        if($res[0]['usertype']!==1) ajaxreject('invaliduser', 'Sorry, this action requires admin privleges');

        // Now, create the map
        DanDBList("INSERT INTO gamemap (name, tiles, waves) VALUES (?,?,?);", 'sss', [$con['mapname'], "[]", "[]"],
                  'server/admin.php->case CreateMap->create map');
        // So... that should be all we need to do. Respond to the request with a success state
        die(json_encode(['result'  =>'success',]));
    break;        
}

?>



