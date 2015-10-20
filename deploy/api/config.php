<?php
@ini_set('memory_limit', '256M');
@date_default_timezone_set('America/Sao_Paulo');
error_reporting(E_ALL);

/**
*	FILE Paths for PHP:
*	@param API_PATH /absolute/path/someproject/api
*	@param ROOT_PATH /absolute/path/someproject/
*	@param DYNAMIC_PATH /absolute/path/someproject/dynamic/
*	@param RELATIVE_URL someproject/
*	@param ROOT_URL http:/domain/someproject/
*/
define('API_PATH', dirname(realpath(__FILE__)) . '/');
define('ROOT_PATH', dirname(API_PATH) . '/');
define('DYNAMIC_PATH', ROOT_PATH . 'dynamic/');


$http = "http";
if(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') $http = 'https';
if(isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https') $http = 'https';

$pageURL = $http . '://';
$relative = dirname(dirname(substr(__FILE__, strlen($_SERVER['DOCUMENT_ROOT'])))) . '/';
if(strlen(preg_replace('/[\.\/]/', '', $relative)) === 0)
{
	$relative = '/';
}
$relative = '/'.ltrim($relative, '/');

define('RELATIVE_URL', $relative);

$base = dirname(substr($_SERVER['SCRIPT_FILENAME'], strlen($_SERVER['DOCUMENT_ROOT']))) . '/';
if(strlen(preg_replace('/[\.\/]/', '', $base)) === 0)
{
	$base = '/';
}
$base = '/'.ltrim($base, '/');


$pageURL .= $_SERVER["HTTP_HOST"].RELATIVE_URL;
$pageURL = rtrim($pageURL, '/') . '/';

define('ROOT_URL', $pageURL);



define('CMS_SESSION_TIMEOUT', '60000');

define('TIME_DIFF', 0);


if(preg_match('/^local(\.|host)/', $_SERVER['SERVER_NAME']))
{
	$db_host = 'localhost';
	$db_name = 'slikland-cms';
	$db_user = 'root';
	$db_pass = '';
}
else if(preg_match('/^(b_.*?\.)?dev\./', $_SERVER['SERVER_NAME']))
{
	// dev
	$db_host = 'mysql.homolog.slik.land';
	$db_name = 's253dev';
	$db_user = 's253dev';
	$db_pass = 'dF28e0ZAdf';
}
else if(preg_match('/^(b_.*?\.)?client\./', $_SERVER['SERVER_NAME']))
{
	// client
	$db_host = 'mysql.homolog.slik.land';
	$db_name = 's253dev';
	$db_user = 's253dev';
	$db_pass = 'dF28e0ZAdf';
}else{
	switch($_SERVER['SERVER_NAME'])
	{
		case 's253.local.slikland.com':
			$db_host = '127.0.0.1';
			$db_name = 's253local';
			$db_user = 'root';
			$db_pass = '';
			break;
		case 's253.dev.slikland.com':
			// $db_host = '127.0.0.1';
			// $db_name = 's102';
			// $db_user = 'root';
			$db_pass = '';
			$local = true;
			$db_host = 'mysql.homolog.slik.land';
		    $db_name = 's253dev';
		    $db_user = 's253dev';
		    $db_pass = 'dF28e0ZAdf';
			break;
		case 's253.client.slikland.com':
			$local = false;
			$db_host = 'mysql.homolog.slik.land';
			$db_name = 's253client';
			$db_user = 's253client';
			$db_pass = 'pidDs813nf';
			break;
		default:
			$local = false;
			$db_host = '';
			$db_name = '';
			$db_user = '';
			$db_pass = '';
			break;
	}

}

define('DB_HOST', $db_host);
define('DB_NAME', $db_name);
define('DB_USER', $db_user);
define('DB_PASS', $db_pass);
?>
