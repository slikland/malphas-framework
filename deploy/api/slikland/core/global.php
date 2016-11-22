<?php

if(!function_exists('isAssoc'))
{
	function isAssoc($arr)
	{
		if (!is_array($arr)) return false;
		return array_keys($arr) !== range(0, count($arr) - 1);
	}
}


function execute($servicePath = NULL, $data = NULL, $output = TRUE){
	$result = slikland\core\ServiceController::execute($servicePath, $data, $output);
	return $result;
}

$_headers = [];

function set_header($value, $rewrite = TRUE, $code = NULL)
{
	global $_headers;
	preg_match('/^(.*?)(?::\s*(.*?)\s*)?$/', $value, $match);
	$name = isset($match[1])?trim($match[1]):'';
	if($rewrite)
	{
		$i = count($_headers);
		while(--$i > 0)
		{
			if($_headers[$i]['name'] == $name)
			{
				unset($_headers[$i]);
			}
		}
	}

	$_headers[] = array('name'=>$name, 'value'=>$value, 'rewrite'=>$rewrite, 'code'=>$code);
}

function print_headers()
{
	global $_headers;
	foreach($_headers as $value)
	{
		header($value['value'], $value['rewrite'], $value['code']);
	}
}

function output($data = NULL, $format = 'json')
{
	$output = '';
	$output = @(string)$data;
	try{
		switch(strtolower($format))
		{
			case 'html':
				set_header('Content-type: text/html');
				break;
			case 'download':
				set_header('Content-type: application/octet-stream');
				break;
			case 'json':
			default:
				$output = @json_encode($data);
				set_header('Content-type: text/plain');
				break;
		}
	}catch(Exception $e)
	{
		if(DEBUG)
		{
			var_dump($e);
		}
	}
	print_headers();
	print $output;
}

function outputFileName($name)
{
	set_header('Content-Disposition: attachment; filename="'.$name.'"');
}

function debug()
{
	slikland\log\Debug::log();
}

function error($error, $code, $data = NULL)
{
	if(!($error instanceof \slikland\error\Error))
	{
		$error = new \slikland\error\Error($error, $code, $data);
	}

	switch($error->getCode())
	{
		case '404':
			set_header('HTTP/1.0 404 Not Found', TRUE, 404);
			break;
		case '500':
			set_header('HTTP/1.0 500 Internal Server Error', TRUE, 500);
			break;
		case '501':
			set_header('HTTP/1.0 500 Internal Server Error', TRUE, 501);
			break;
	}
	throw $error;
}

function password($password, $key = NULL)
{
	return \slikland\utils\crypt\Password::encode($password, $key);
}

function uid_encode($id)
{
	return \slikland\utils\crypt\UID::encode($id);
}

function uid_decode($uid)
{
	return \slikland\utils\crypt\UID::decode($uid);
}

function get_module($moduleName)
{
	$modulePath = '/module/';
	$module = preg_replace('/\//', '\\', $modulePath . $moduleName);
	if(!class_exists($module))
	{
		$module = preg_replace('/\//', '\\', '/slikland' . $modulePath . $moduleName);
	}
	if(!class_exists($module))
	{
		return;
	}

	try{
		if(method_exists($module, 'getInstance'))
		{
			return $module::getInstance();
		}
	}catch(Exception $e)
	{
		if(DEBUG)
		{
			var_dump($e);
		}
	}
	return new $module();
}

function checkHost($hostRE)
{
	return (bool)preg_match($hostRE, HOST);
}

function db($host = NULL, $user = NULL, $pass = NULL, $name = NULL, $port = NULL)
{
	global $config;
	$host = ($host)?$host:((isset($config['db_host']))?$config['db_host']:NULL);
	$user = ($user)?$user:((isset($config['db_user']))?$config['db_user']:NULL);
	$pass = ($pass)?$pass:((isset($config['db_pass']))?$config['db_pass']:NULL);
	$name = ($name)?$name:((isset($config['db_name']))?$config['db_name']:NULL);
	$port = ($port)?$port:((isset($config['db_port']))?$config['db_port']:NULL);
	return \slikland\db\DB::getInstance($host, $user, $pass, $name, $port);
}

function log_activity($action = '', $description = '', $data = '')
{
	$db = @db();
	if($db)
	{
		if(empty($data))
		{
			$data = '';
		}else if(is_array($data))
		{
			obfuscatePassword($data);
			$data = json_encode($data);
		}

		$userModule = get_module('cms/User');
		$sessionId = $userModule->getSessionId();
		@$db->insert('INSERT INTO cms_log (fk_cms_session, action, description, data, created) VALUES (?, ?, ?, ?, NOW());', array($sessionId, $action, $description, $data));
	}
}

function obfuscatePassword(&$data)
{
	foreach($data as $k=>&$v)
	{
		if(is_string($v))
		{
			if(preg_match('/((^pass)|(password))/i', $k))
			{
				$v = '***';
			}
		}elseif (is_array($v)) {
			obfuscatePassword($v);
		}
	}
}


