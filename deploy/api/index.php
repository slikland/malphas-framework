<?php
session_start();
set_include_path(__DIR__ . '/');
set_time_limit(10);

date_default_timezone_set('America/Sao_Paulo');
header('Access-Control-Allow-Origin: *');
Header('Cache-Control: no-cache');
Header('Edge-Control: no-cache');

$debug = FALSE;
$host = '';
if(isset($_SERVER['HTTP_HOST']))
{
	$host = $_SERVER['HTTP_HOST'];
}
if(isset($_GET['__debug__']) || preg_match('/(127\.0\.0\.1|localhost|local\.slikland|dev\.s\d+\.slikland)/',$host))
{
	$debug = TRUE;
	@ini_set('display_errors', 'On');
	@error_reporting(E_ALL ^ E_DEPRECATED);
}else{
	@ini_set('display_errors', 'Off');
	@error_reporting(0);
}

define('DEBUG', $debug);

include_once('config.php');
include_once('slikland/AutoLoader.php');
class_alias('\slikland\core\Setting', 'Setting');
class_alias('\slikland\error\ServiceError', 'ServiceError');
class_alias('\slikland\error\CodedError', 'CodedError');
class_alias('\slikland\fs\File', 'File');

include('slikland/core/ServiceController.php');

if(realpath($_SERVER['SCRIPT_FILENAME']) == realpath(__FILE__)){
	execute(NULL, NULL, TRUE);
}

