<?php
namespace module\social;

class Google
{

	private $_settings = array(
		'key' => 'Key',
	);

	private $_name = NULL;

	static $ENDPOINTS = array(
		'translate' => 'https://translation.googleapis.com/language/translate/v2',
	);

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
		$prefix = $this->name();
		foreach($this->_settings as $k=>$v)
		{
			$value = @$data[$k];
			Setting::set($prefix . '-' . $k, $value);
		}
	}

	public function get($endpoint, $url, $data = NULL)
	{
		return $this->call('GET', $endpoint, $url, $data);
	}

	public function post($endpoint, $url, $data = NULL)
	{
		return $this->call('POST', $endpoint, $url, $data);
	}

	public function call($method, $endpoint, $url, $data = NULL)
	{
		if(!$data)
		{
			$data = array();
		}
		$endpointURL = @static::$ENDPOINTS[$endpoint];
		$settings = $this->getSettings();
		$data['key'] = $settings['key'];
		$request = get_module('net/Request');
		$url = trim($endpointURL, '/') . '/' . trim($url, '/');
		$response = $request->loadURL($url, $data, NULL, $method);

		if($response)
		{
			try{
				$response =json_decode($response, TRUE);
			}catch(\Exception $e)
			{

			}
		}
		return $response;
	}

}