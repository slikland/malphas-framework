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

$http = "http";
if(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') $http = 'https';
if(isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https') $http = 'https';

$host = $http . '://' . $_SERVER['HTTP_HOST'];
$rootPath = dirname(dirname(__FILE__));
$scriptPath = realpath(dirname($_SERVER['SCRIPT_FILENAME']));
$rootPathRE = str_replace('/', '\\/', $rootPath);
$path = str_replace('/', '\\/', preg_replace('/^' . $rootPathRE . '/', '', $scriptPath));
$relativeRootPath = preg_replace('/' . $path . '$/', '', dirname($_SERVER['SCRIPT_NAME']));
$requestURI = preg_replace('/^' . str_replace('/', '\\/', $relativeRootPath) . '/', '', $_SERVER['REQUEST_URI']);

$rootPath .= '/';
$relativeRootPath .= '/';
$rootURL = $host . $relativeRootPath;
$currentURL = rtrim($rootURL, '/') . $requestURI;

define('API_PATH', $rootPath . 'api/');
define('ROOT_PATH', $rootPath);
define('DYNAMIC_PATH', $rootPath . 'dynamic/');
define('RELATIVE_URL', rtrim($relativeRootPath, '/') . '/');
define('ROOT_URL', rtrim($rootURL, '/') . '/');
define('REQUEST_URI', $requestURI);
define('CURRENT_URL', $currentURL);


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
	$db_host = 'mysql.dev.slikland.net';
	$db_name = '';
	$db_user = '';
	$db_pass = '';
}
else if(preg_match('/^(b_.*?\.)?client\./', $_SERVER['SERVER_NAME']))
{
	// client
	$db_host = 'mysql.client.slikland.net';
	$db_name = '';
	$db_user = '';
	$db_pass = '';
}else{
	switch($_SERVER['SERVER_NAME'])
	{
		default:
			$db_host = 'mysql.dev.slikland.net';
			$db_name = 'sliklandcmsdev';
			$db_user = 'sliklandcmsdev';
			$db_pass = 'FX9a83lb';
			break;
	}

}

define('DB_HOST', $db_host);
define('DB_NAME', $db_name);
define('DB_USER', $db_user);
define('DB_PASS', $db_pass);
?>
