<?php
namespace module\social;

class Recaptcha extends \slikland\core\pattern\Singleton
{

	private $_settings = array(
		'key' => 'Client Key',
		'secret' => 'Secret Key',
	);

	private $_name = NULL;

	const ENDPOINT = 'https://www.google.com/recaptcha/api/siteverify';
	public function name()
	{
		if(!$this->_name)
		{
			$name = (String)__CLASS__;
			$name = preg_replace('/.*?([^\\\\]+)$/', '$1', $name);
			$this->_name = $name;
		}
		return $this->_name;
	}

	function getSettings($fullObject = FALSE)
	{
		$prefix = $this->name();
		$settings = array();
		foreach($this->_settings as $k=>$v)
		{
			if($fullObject)
			{
				$settings[] = array('name'=>$prefix . '-' . $k, 'value'=>Setting::get($prefix . '-' . $k), 'label'=>$v);
			}else{
				$settings[$k] = Setting::get($prefix . '-' . $k);
			}
		}
		return $settings;
	}

	function setSettings($data)
	{
		var_dump($data);
		$prefix = $this->name();
		foreach($this->_settings as $k=>$v)
		{
			$value = @$data[$k];
			Setting::set($prefix . '-' . $k, $value);
		}
	}

	function validate($value, $data)
	{
		$settings = $this->getSettings();
		$secret = $settings['secret'];
		if(!$secret)
		{
			throw new ServiceError('Recaptcha Secret is not set');
		}
		$data = array(
			'secret'=> $secret,
			'response'=>$value
		);

		$requestModule = get_module('net/Request');
		$result = $requestModule->post(self::ENDPOINT, $data);

		$success = FALSE;
		if($result)
		{
			try{
				$result = json_decode($result, TRUE);
				if($result['success'])
				{
					$success = TRUE;
				}
			}catch(Exception $e)
			{
			}
		}
		return $success;

	}
}