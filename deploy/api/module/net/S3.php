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
	private $_endpoint = NULL;
	private $settings = NULL;
	private $_active = NULL;
	private $_url = NULL;

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

	public function active()
	{
		if($this->_active === NULL)
		{
			$settings = $this->getSettings();
			$this->_active = isset($settings['secret']) && !empty(@$settings['secret']);
		}

		return $this->_active;
	}

	public function endpoint()
	{
		if($this->_endpoint === NULL)
		{
			$settings = $this->getSettings();
			$this->_endpoint = @$settings['endpoint'];
		}
		return $this->_endpoint;
	}

	public function url()
	{
		if($this->_url === NULL)
		{
			$settings = $this->getSettings();
			$this->_url = @$settings['url'];
		}
		return $this->_url;
	}

	function getSettings($fullObject = FALSE)
	{
		if(!$this->settings || $fullObject)
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
		}
		if(!$fullObject)
		{
			if(@$settings)
			{
				$this->settings = $settings;
			}else{
				$settings = $this->settings;
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

		$this->updateBucketCors();
	}

	private function updateBucketCors()
	{
		$settings = $this->getSettings();

		if($settings && @$settings['bucket'] && @$settings['secret'] && @$settings['key'])
		{
			$client = $this->getClient();
			$client->putBucketCors([
				'Bucket'=>$settings['bucket'],
				'CORSRules'=>[
					'AllowedHeaders'=>['*'],
					'MaxAgeSeconds'=>3000,
					'AllowedMethods'=>['GET'],
					'AllowedOrigins'=>['*'],
				],
			]);
		}
	}

	private function getClient()
	{
		if(!$this->_client)
		{
			$settings = $this->getSettings();
			if(!$settings['url']) return;

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
				throw new ServiceError('S3 error');
			}
		}
		return $this->_client;
	}

	function upload($file, $to, $gzip = TRUE, $public = TRUE)
	{
		if(!$this->active()) return;

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
			$requestModule = get_module('net/Request');
			$content = $requestModule->loadURL($file);
		}else
		{
			$contentType = mime_content_type($file);
			$content = file_get_contents($file);
		}

		if(!$contentType || empty($contentType))
		{
			if(preg_match('/\.json$/', $file))
			{
				$contentType = 'text/json; charset=utf-8';
			}
		}

		return $this->write($content, $to, $contentType, $gzip, $public);
	}

	function write($content, $to, $contentType = NULL, $gzip = TRUE, $public = TRUE)
	{

		$client = $this->getClient();
		if(!$client) return;
		$object = [
			'Bucket' => $this->_bucket,
		];

		if($public)
		{
			$object['ACL'] = 'public-read';

		}

		if($gzip)
		{
			try{
				$gzipped = gzencode($content, 9);
				if(strlen($gzipped) > 0)
				{
					$content = $gzipped;
					$object['ContentEncoding'] = 'gzip';
				}
			}catch(\Exception $e)
			{

			}
		}

		$object['Key'] = $to;
		$object['Body'] = $content;
		$object['ContentType'] = $contentType;

		try {
			$result = $client->putObject($object);
		}catch(\Exception $e)
		{
			print($e->getMessage());
			throw new ServiceError('S3 error');
		}
		
		if(isset($result))
		{
			return $to;
		}
		return NULL;
	}

	function getURL($path, $downloadable = FALSE)
	{
		$client = $this->getClient();
		if(!$client) return;

		$commandData = [
			'Bucket'=>$this->_bucket,
			'Key'=>$path,
		];

		if($downloadable)
		{
			$pathName = preg_replace('/^.*?\/?([^\/]+)$/', '$1', $path);
			$commandData['ResponseContentDisposition'] = 'attachment; filename="'.$pathName.'"';
		}

		$cmd = $client->getCommand('GetObject', $commandData);
		$request = $client->createPresignedRequest($cmd, '+10 minutes');
		$url = (string)$request->getUri();
		return $url;
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
			throw new ServiceError('S3 error');
		}
		return TRUE;
	}
}
