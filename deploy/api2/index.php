<?php
session_start();

set_include_path(dirname(__FILE__) . '/');
// header('Content-type: text/plain');

//ini_set('display_errors', true);
//error_reporting(0);


include_once('config.php');
include_once('slikland/AutoLoader.php');

try{
	slikland\core\ServiceController::execute();
}catch(Exception $e)
{
	// @header('Content-type: text/html');
	print $e;
}

?>