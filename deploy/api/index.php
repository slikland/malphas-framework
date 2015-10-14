<?php

//ini_set('display_errors', true);
//error_reporting(0);


session_start();

set_include_path(dirname(__FILE__) . '/');
header('Content-type: text/plain');

// function sl_autoloader($class)
// {
// 	// class_alias()$class
// 	class_alias('\\bla\\test', $class);
// 	var_dump($class);
// 	return False;
// }
// spl_autoload_register('sl_autoloader');

// include_once('test.php');
// var_dump(new test());

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