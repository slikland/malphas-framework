<?php
namespace slikland\utils;
class ServiceAnnotations
{
	public static function check_permission($data)
	{
		call_user_func(array(get_module('cms/User'), 'checkPermission'), $data);
	}

	public static function authenticate($data)
	{
		$user = get_module('cms/User');
		$user = $user->getCurrent();
		if(!$user)
		{
			header('Location: ' . CMS_URL . '?__redirect__=' . rawurlencode(CURRENT_URL));
			die();
		}
	}

	public static function request_method($data, &$params)
	{
		$rm = $_SERVER['REQUEST_METHOD'];
		if(!in_array($rm, $data))
		{
			error('Invalid request method ' . $rm, 500);
		}

		$requestHeaders = getallheaders();
		switch ($rm)
		{
			case 'GET':
				$data = (array)$_GET;
				break;
			case 'POST':
				if(isset($requestHeaders['Content-Type']) && preg_match('/\/json/i', $requestHeaders['Content-Type']))
				{
					$data = array('data'=>json_decode(file_get_contents('php://input'), TRUE));
				}else{
					$data = (array)$_POST;
				}
				break;
			default:
				$data = (array)$_REQUEST;
				break;
		}

		$params['data'] = $data;
	}

	public static function merge_params($data, &$params)
	{
		if(!empty($data)) $params['data'] = array_merge($params['data'], $data);
	}

	public static function validate_params($data, $params)
	{
		\slikland\validation\Validator::validate($params['data'], $data);

	}

	public static function set_output($data, &$params)
	{
		$params['format'] = @$data[0];
		setOutputFormat($data[0]);
	}

	public static function set_filename($data)
	{
		@outputFileName($data[0]);
	}
}
