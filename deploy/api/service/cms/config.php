<?php
namespace service\cms;

class config
{
	static $_apis = array(
		array('name'=>'Geral', 'module'=>'ford/Service'),
		array('name'=>'Facebook', 'module'=>'social/Facebook'),
		array('name'=>'Google Maps API', 'module'=>'social/GoogleMaps'),
		array('name'=>'Google Plus', 'module'=>'social/GooglePlus'),
		array('name'=>'Recaptcha', 'module'=>'social/Recaptcha'),
		array('name'=>'Email (SMTP)', 'module'=>'net/Mail'),
		array('name'=>'Amazon S3', 'module'=>'net/S3'),
		array('name'=>'Cache', 'module'=>'ford/Cache'),
	);

	/**
	@permission ["superadmin", "admin"]
	*/
	function apis($data)
	{
		$response = array();
		foreach(static::$_apis as $item)
		{
			$module = get_module($item['module']);
			$response[] = array('label'=>$item['name'], 'items'=>$module->getSettings(TRUE));
		}

		return $response;
	}

	/**
	@permission ["superadmin", "admin"]
	*/
	function updateApis($data)
	{
		foreach(static::$_apis as $item)
		{
			$module = get_module($item['module']);
			$values = $module->getSettings(TRUE);
			foreach($values as $value)
			{
				$v = @$data[$value['name']];
				Setting::set($value['name'], $v);
			}
		}
		return TRUE;
	}
}