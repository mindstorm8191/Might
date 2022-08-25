<?php
/*  signup.php
    Allows new users to sign up to play the game. Accounts are used to keep a player's progress saved
    For the game Might
*/

require_once("config.php");
require_once("common.php");
require_once('jsarray.php');

// Start with collecting the actual message from the client's request
require_once("getInput.php");

// Verify the input that was provided
$con = verifyInput($msg, [
    ["name"=>"username", "required"=>true, "format"=>"stringnotempty"],
    ["name"=>"password", "required"=>true, "format"=>"stringnotempty"],
    ["name"=>"pass2", "required"=>true, "format"=>"stringnotempty"],
    ["name"=>"email", "required"=>true, "format"=>"email"]
], 'server/routes/signup.php->verify input');
// Also check that the two passwords match
if($con['password'] !== $con['pass2']) ajaxreject('badinput', 'Your passwords did not match');

// Set up some randomized variables to use for this user
srand(time());
$ajaxcode = rand(0, pow(2, 31));
$emailcode = rand(0, pow(2, 31)); // We should also be sending the user a verification email, but we don't have that option on LocalHost

// With this much information, we can go ahead and make the user's DB record
DanDBList("INSERT INTO player (name, password, email, emailcode, ajaxcode, ipaddress, lastlogin) VALUES (?,?,?,?,?,?,NOW());",
          'sssiis', [$con['username'], $con['password'], $con['email'], $emailcode, $ajaxcode, $_SERVER['REMOTE_ADDR']],
          'ajax.php->action signup->add new user');
$playerid = mysqli_insert_id($db);

// Note that there are no options to make an admin user; admins must be added via database edits

// Well, that's about all we really need to do here, since there's no world to manage this time. Send the user a Success message
die(json_encode([
    'result'  =>'success',
    'userid'  =>$playerid,
    'usertype'=>'player',
    'username'=>$con['username'],
    'ajaxcode'=>$ajaxcode,
]));


