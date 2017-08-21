<?php
namespace module\net;
require_once('vendors/aws/aws-autoloader.php');

// class S3 extends \slikland\core\pattern\Singleton
class S3
{
	private $_settings = array(
		'url' => 'URL',
		'endpoint' => 'Endpoint',
		'key' => 'Key',
		'secret' => 'Secret',
		'bucket' => 'Bucket Name',
		'region' => 'Region',
	);

	private $_name = NULL;
	private $_client = NULL;

	public function url()
	{
		if(!@$this->_url)
		{
			$settings = $this->getSettings();
			$this->_url = $settings['url'];
		}
		return $this->_url;
	}

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

	private function getClient()
	{
		if(!$this->_client)
		{
			$settings = $this->getSettings();

			$this->_url = $settings['url'];
			$this->_endpoint = $settings['endpoint'];
			if(empty($this->_endpoint)) $this->_endpoint = NULL;
			$this->_key = $settings['key'];
			$this->_secret = $settings['secret'];
			$this->_bucket = $settings['bucket'];
			$this->_region = $settings['region'];
			try{
				$this->_client = new \Aws\S3\S3Client([
					'version'     => 'latest',
					'region'      => $this->_region,
					'endpoint'      => $this->_endpoint,
					'credentials' => [
						'key'    => $this->_key,
						'secret' => $this->_secret,
					],
				]);
			}catch(\Exception $e)
			{
				throw new Error('S3 error');
			}
		}
		return $this->_client;
	}

	function upload($file, $to)
	{
		$client = $this->getClient();
		if(preg_match('/^http/', $file))
		{
			$headers = get_headers($file);
			$contentType = '';
			foreach ($headers as $header) {
				if(preg_match('/Content-Type:\s*([^\s]+)\s*$/i', $header, $matches))
				{
					$contentType = $matches[1];
					break;
				}
			}
		}else
		{
			$contentType = mime_content_type($file);
		}
		$content = file_get_contents($file);

		try {
			$result = $client->putObject([
				'Bucket' => $this->_bucket,
				'Key'    => $to,
				'Body'   => $content,
				'ContentType' => $contentType,
				'ACL' => 'public-read'
			]);
		}catch(\Exception $e)
		{
			print($e->getMessage());
			throw new Error('S3 error');
		}
		
		if(isset($result))
		{
			return $to;
		}
		return NULL;
	}

	function delete($path)
	{
		$client = $this->getClient();
		try {
			$result = $client->putObject([
				'Bucket' => $this->_bucket,
				'Key'    => $path,
			]);
		}catch(\Exception $e)
		{
			throw new Error('S3 error');
		}
		return TRUE;
	}
}
