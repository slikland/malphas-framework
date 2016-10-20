<?php

$config = array();

$cofig['db_host'] = '';


$host = strtolower($_SERVER['HTTP_HOST']);

switch($host)
{
	case ((bool)preg_match('/^local\.?/', $host)):
		$config['db_host'] = 'localhost';
		$config['db_name'] = 'test';
		$config['db_user'] = 'root';
		$config['db_pass'] = '';
		$config['db_port'] = 3306;
		break;
	default:
		var_dump(456);
		break;
}

