<?php
session_start();
set_include_path(__DIR__ . '/');

$debug = FALSE;
if(isset($_GET['__debug__']) || preg_match('/(127\.0\.0\.1|localhost|local\.slikland|dev\.s\d+\.slikland)/',$_SERVER['HTTP_HOST']))
{
	$debug = TRUE;
	@ini_set('display_errors', 'On');
	@error_reporting(E_ALL);
}else{
	@ini_set('display_errors', 'Off');
	@error_reporting(0);
}

define('DEBUG', $debug);

include_once('config.php');
include_once('slikland/AutoLoader.php');
include('slikland/core/ServiceController.php');
class_alias('\slikland\core\Setting', 'Setting');
class_alias('\slikland\error\Error', 'Error');
class_alias('\slikland\error\CodedError', 'CodedError');

if(realpath($_SERVER['SCRIPT_FILENAME']) == realpath(__FILE__)){
	execute();
}
