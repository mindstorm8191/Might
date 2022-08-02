<?php
    /* getmedia.php
       Provides files for the client side, bypassing CORS restrictions
       For the game Dark Sun
    */
    
    // Start by managing CORS. All that is necessary is to permit certain sources to be used. This will be passed back in the client's
    // response, so the browser can accept it.
    /*
    if($_SERVER['HTTP_ORIGIN']=="http://localhost:3000") header('Access-Control-Allow-Origin: http://localhost:3000');
    if($_SERVER['HTTP_ORIGIN']=="http://localhost:3001") header('Access-Control-Allow-Origin: http://localhost:3001');
    if($_SERVER['HTTP_ORIGIN']=="http://localhost:80") header('Access-Control-Allow-Origin: http://localhost:80');
        */
    //sleep(5);
    header('Access-Control-Allow-Origin: http://localhost:3000');
    
    // We'll worry about loading specific files later
    echo file_get_contents("media/". $_GET['file']);
?>
