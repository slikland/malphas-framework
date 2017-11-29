<?php

$config = array();

$cofig['db_host'] = '';

$config['cms_path'] = 'cms/';
//TEMP

define('CMS_SESSION_TIMEOUT', 7200);


$host = strtolower($_SERVER['HTTP_HOST']);

$config['dynamic_url'] = '';
switch($host)
{
	case ((bool)preg_match('/(local\.?|localhost)/', $host)):
	case ((bool)preg_match('/^192\.168/', $host)):
		if(@getenv('ENVIRONMENT') == 'sl_local')
		{
			$config['db_host'] = 'localhost';
			$config['db_name'] = '';
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

