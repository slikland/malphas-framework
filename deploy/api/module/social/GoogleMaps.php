<?php
namespace module\social;

class GoogleMaps extends \slikland\core\pattern\Singleton
{

	private $_settings = array(
		'geoloc_key' => 'Google Geoloc Key',
		'directions_key' => 'Google Directions Key',
	);

	private $_name = NULL;

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


	function geolocAddress($address)
	{
		if(!@$this->requestModule)
		{
			$this->requestModule = get_module('net/Request');
		}
		$settings = $this->getSettings();
		$key = $settings['geoloc_key'];

		// $from = $this->parseLocation($from);
		// $to = $this->parseLocation($to);

		$requestData = [
			// 'origin'=> $from,
			// 'destination'=>$to,
			// 'units'=>'metric',
			// 'alternatives'=>'false',
			// 'key'=>$key,
			'address'=>$address,
			'region'=>'br',
		];

		$response = $this->requestModule->get('https://maps.googleapis.com/maps/api/geocode/json', $requestData);
		$response = json_decode($response, TRUE);
		return @$response['results'][0]['geometry']['location'];

		return $response;
		// return @$response['routes'][0]['legs'][0]['distance']['value'];
	}

	function getDistance($from, $to)
	{
		if(!@$this->requestModule)
		{
			$this->requestModule = get_module('net/Request');
		}
		$settings = $this->getSettings();
		$key = $settings['geoloc_key'];
		$key = Setting::get('directions_key');

		$from = $this->parseLocation($from);
		$to = $this->parseLocation($to);

		$requestData = array(
			'origin'=> $from,
			'destination'=>$to,
			'units'=>'metric',
			'alternatives'=>'false',
			'key'=>$key,
		);

		$response = $this->requestModule->get('https://maps.googleapis.com/maps/api/directions/json', $requestData);
		$response = json_decode($response, TRUE);
		return @$response['routes'][0]['legs'][0]['distance']['value'];
	}

	private function parseLocation($loc)
	{
		if(is_array($loc))
		{
			if(isAssoc($loc))
			{
				$loc = @$loc['lat'] . ',' . @$loc['lon'];
			}else{
				$loc = @$loc[0] . ',' . @$loc[1];
			}
		}

		return $loc;
	}
}