<?php
@ini_set('memory_limit', '256M');
@date_default_timezone_set('America/Sao_Paulo');
error_reporting(E_ALL);

// PATHS
define('API_PATH', dirname(realpath(__FILE__)) . '/');
define('ROOT_PATH', dirname(API_PATH) . '/');
define('DYNAMIC_PATH', ROOT_PATH . 'dynamic/');
// define('BASE_URL', ROOT_PATH . 'dynamic/');


$http = "http";
if(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') $http = 'https';
if(isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https') $http = 'https';

$live = false;
$usingIP = false;
$local = false;

$useMock = false;

define('CMS_SESSION_TIMEOUT', '60000');


if(preg_match('/192\.168\..*?$/', $_SERVER['HTTP_HOST']))
{
	$useMock = true;
}

$db_host = 'mysql.homolog.slik.land';
$db_name = 's253dev';
$db_user = 's253dev';
$db_pass = 'dF28e0ZAdf';

switch($_SERVER['SERVER_NAME'])
{

	case 'local.slikland.com':
		$db_host = 'mysql.homolog.slik.land';
	    $db_name = 's253dev';
	    $db_user = 's253dev';
	    $db_pass = 'dF28e0ZAdf';
		// $db_host = 'localhost';
	 //    $db_name = 's253local';
	 //    $db_user = 'root';
	 //    $db_pass = '';
		$local = true;
		break;
	case 's253.local.slikland.com':
		$db_host = '127.0.0.1';
		$db_name = 's253local';
		$db_user = 'root';
		$db_pass = '';
		$local = true;
		if(!isset($_SERVER['DOCUMENT_ROOT']) || !strpos($_SERVER['DOCUMENT_ROOT'], 'keita'))
		{
			$useMock = true;
		}
		break;
	case 'localhost':
		if(!isset($_SERVER['DOCUMENT_ROOT']) || !strpos($_SERVER['DOCUMENT_ROOT'], 'keita'))
		{
			$useMock = true;
		}
		$db_host = 'mysql.homolog.slik.land';
	    $db_name = 's253dev';
	    $db_user = 's253dev';
	    $db_pass = 'dF28e0ZAdf';
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


	case 'qa.fordfocusfastback.com.br':
		$local = false;
		$db_host = 'dbfordfocus.cedfumk26nrn.us-east-1.rds.amazonaws.com';
		$db_name = 'qa_fordfocusfastback';
		$db_user = 'qafocusfastback';
		$db_pass = 'SDdssdRR2ss';
		break;
	default:
		$local = false;
		$db_host = 'dbfordfocus.cedfumk26nrn.us-east-1.rds.amazonaws.com';
		$db_name = 'qa_fordfocusfastback';
		$db_user = 'qafocusfastback';
		$db_pass = 'SDdssdRR2ss';
		break;
}

define('DB_HOST', $db_host);
define('DB_NAME', $db_name);
define('DB_USER', $db_user);
define('DB_PASS', $db_pass);


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
define('PAGE_URL', $pageURL);


define('BASE_URL', $http . '://' . $_SERVER["HTTP_HOST"].$base);

if(strpos($_SERVER['HTTP_HOST'], 'comparativofocus.com.br') !== FALSE)
{
	if(strpos($_SERVER['HTTP_HOST'], 'qa.') <= 2)
	{
		$rootURL = '://qa.fordfocusfastback.com.br/';
	}else
	{
		$rootURL = $http.'://wwww.fordfocusfastback.com.br/';
	}
}else
{
	$rootURL = $pageURL; 
}

define('ROOT_URL', $rootURL);
define('STRUCTURE_URL', ROOT_URL . 'structure/');

define('TIME_DIFF', 0);

?>
