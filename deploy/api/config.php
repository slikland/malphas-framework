<?php

define('CMS_SESSION_TIMEOUT', 7200);

set_include_path(__DIR__ . '/');
set_time_limit(10);

date_default_timezone_set('America/Sao_Paulo');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: no-cache');
header('Edge-Control: no-cache');

$config = [];
$debug = FALSE;

if(isset($_SERVER['HTTP_HOST'])) {
    $host = $_SERVER['HTTP_HOST'];
}
if(isset($_GET['__debug__']) || preg_match('/(127\.0\.0\.1|localhost|local\.slikland|dev\.s\d+\.slikland)/',$host)) {
    $debug = TRUE;
    @ini_set('display_errors', 'On');
    @error_reporting(E_ALL ^ E_DEPRECATED);
} else {
    @ini_set('display_errors', 'Off');
    @error_reporting(0);
}

define('DEBUG', $debug);


$host = strtolower($_SERVER['HTTP_HOST']);
switch($host)
{
	case ((bool)preg_match('/(local\.?|localhost)/', $host)):
	case ((bool)preg_match('/^192\.168/', $host)):
		if(@getenv('ENVIRONMENT') == 'sl_local')
		{
			$config['db_host'] = 'localhost';
			$config['db_name'] = 'cms';
			$config['db_user'] = 'root';
			$config['db_pass'] = '';
			$config['db_port'] = 3306;
		}else
		{
			$config['db_host'] = 'mysql.dev.slikland.net';
			$config['db_name'] = '';
			$config['db_user'] = '';
			$config['db_pass'] = '';
			$config['db_port'] = 3306;
		}
		break;
	case ((bool)preg_match('/dev\.s\d+\.slikland\.net?/', $host)):
		$config['db_host'] = 'mysql.dev.slikland.net';
		$config['db_name'] = '';
		$config['db_user'] = '';
		$config['db_pass'] = '';
		$config['db_port'] = 3306;
		break;
	case ((bool)preg_match('/client\.s\d+\.slikland\.net?/', $host)):
		$config['db_host'] = 'mysql.client.slikland.net';
		$config['db_name'] = '';
		$config['db_user'] = '';
		$config['db_pass'] = '';
		$config['db_port'] = 3306;
		break;
	default:
		break;
}

