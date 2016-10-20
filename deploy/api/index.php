<?php
session_start();
set_include_path(__DIR__ . '/');

if(isset($_GET['__debug__']))
{
	@ini_set('display_errors', 'On');
	@error_reporting(E_ALL);
}else{
	@ini_set('display_errors', 'Off');
	@error_reporting(0);
}

include_once('config.php');
include_once('slikland/AutoLoader.php');
include('slikland/core/ServiceController.php');
class_alias('\slikland\error\Error', 'Error');

if(realpath($_SERVER['SCRIPT_FILENAME']) == realpath(__FILE__)){
	execute();
}

