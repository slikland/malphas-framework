<?php
namespace module\media;

class CDN
{

	private $_settings = array(
		'alternative_url'=> 'Alternative URL',
		'cdn_url' => 'URL',
		'key'=> 'API KEY',
		'secret'=> 'API SECRET',
		'region'=> 'Region (us-east-1)',
		'distribution_id'=> 'Distribution ID',
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

	function getURL()
	{
		$settings = $this->getSettings();
		$url = $settings['cdn_url'];
		$url = preg_replace('/([^\/])\/*$/', '$1/', $url);
		return $url;
	}


	function invalidate()
	{
		require_once('vendors/aws/aws-autoloader.php');
		$settings = $this->getSettings();

		if(!@$settings['key'] || !@$settings['secret'] || !@$settings['region'] || !@$settings['distribution_id']) return FALSE;
		$cloudfront = \Aws\CloudFront\CloudFrontClient::factory(array(
			'credentials'=>array(
				'key' => $settings['key'],
				'secret' => $settings['secret'],
			),
			'region'=>$settings['region'],
			'version'=>'latest',
		));

		$result = $cloudfront->createInvalidation(array(
			'DistributionId'=>$settings['distribution_id'],
			'InvalidationBatch'=>array(
				'CallerReference'=>'a'.time(),
				'Paths'=>array(
					'Items'=>array('/*'),
					'Quantity'=>1
				)
			)
		));
		return (array)$result;		
	}

}