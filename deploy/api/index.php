<?php

//ini_set('display_errors', true);
//error_reporting(0);

session_start();

set_include_path(dirname(__FILE__) . '/');
header('Content-type: text/plain');
include_once('config.php');
include_once('core/AutoLoader.php');

try{
	sl_core_ServiceController::execute();
}catch(Exception $e)
{
	// @header('Content-type: text/html');
	print $e;
}

?>