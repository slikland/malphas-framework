<?php
/**
*	FILE Paths for PHP:
*	@param API_PATH /absolute/path/someproject/api
*	@param ROOT_PATH /absolute/path/someproject/
*	@param DYNAMIC_PATH /absolute/path/someproject/dynamic/
*	@param RELATIVE_URL someproject/
*	@param ROOT_URL http:/domain/someproject/
*	@param REQUEST_URI /api/someservice
*	@param CURRENT_URL http:/domain/someproject/api/someservice
*/


$http = "http";
if(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') $http = 'https';
if(isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https') $http = 'https';
$secure = ($http == 'https');

$domain = $_SERVER['HTTP_HOST'];
$host = $http . '://' . $domain;
$rootPath = realpath(__DIR__ . '/../../../');
$scriptPath = realpath(dirname($_SERVER['SCRIPT_FILENAME']));
$rootPathRE = str_replace('/', '\\/', $rootPath);
$path = str_replace('/', '\\/', preg_replace('/^' . $rootPathRE . '/', '', $scriptPath));
$relativeRootPath = preg_replace('/' . $path . '$/', '', dirname($_SERVER['SCRIPT_NAME']));
$requestURI = preg_replace('/^' . str_replace('/', '\\/', $relativeRootPath) . '/', '', $_SERVER['REQUEST_URI']);

$rootPath .= '/';
$relativeRootPath .= '/';
$rootURL = $host . $relativeRootPath;
$currentURL = rtrim($rootURL, '/') . $requestURI;

define('HOST', $domain);
define('API_PATH', $rootPath . 'api/');
define('ROOT_PATH', $rootPath);
define('DYNAMIC_PATH', $rootPath . 'dynamic/');
define('RELATIVE_URL', rtrim($relativeRootPath, '/') . '/');
define('ROOT_URL', rtrim($rootURL, '/') . '/');
define('REQUEST_URI', $requestURI);
define('CURRENT_URL', $currentURL);
define('SECURE', $secure);
define('CMS_PATH', $config['CMS_PATH']);
define('CMS_URL', ROOT_URL . CMS_PATH);
define('DB_HOST', $DB_HOST);
define('DB_NAME', $DB_NAME);
define('DB_USER', $DB_USER);
define('DB_PASS', $DB_PASS);