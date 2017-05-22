<?php
session_start();
set_include_path(__DIR__ . '/');

date_default_timezone_set('America/Sao_Paulo');

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
	@error_reporting(E_ALL);
}else{
	@ini_set('display_errors', 'Off');
	@error_reporting(0);
}

define('DEBUG', $debug);

include_once('config.php');
include_once('slikland/AutoLoader.php');
class_alias('\slikland\core\Setting', 'Setting');
class_alias('\slikland\error\Error', 'Error');
class_alias('\slikland\error\CodedError', 'CodedError');
class_alias('\slikland\fs\File', 'File');

include('slikland/core/ServiceController.php');

if(realpath($_SERVER['SCRIPT_FILENAME']) == realpath(__FILE__)){
	execute(NULL, NULL, TRUE);
}
