<?php

$config = array();

$cofig['db_host'] = '';

//TEMP

define('CMS_SESSION_TIMEOUT', 100000000);


$host = strtolower($_SERVER['HTTP_HOST']);

switch($host)
{
	case ((bool)preg_match('/^local\.?/', $host)):
		$config['db_host'] = 'localhost';
		$config['db_name'] = 'slikland-cms';
		$config['db_user'] = 'root';
		$config['db_pass'] = '';
		$config['db_port'] = 3306;
		break;
	default:
		var_dump(456);
		break;
}

