<?php
namespace module\net;
class Request extends \slikland\core\pattern\Singleton
{
	public function loadURL($url, $data = NULL, $header = array(), $method = 'GET', $port = null)
	{
		$data = $this->curl($url, $method, $data, $header, $port);
		return @$data['body'];
	}

	public function getHeader($url)
	{
		return @get_headers($url);
	}

	public function getMimeType($url)
	{
		$headers = @get_headers($url);
		if(!$headers) return NULL;
		$contentType = NULL;
		foreach ($headers as $header) {
			if(preg_match('/Content-Type:\s*([^\s]+)\s*$/i', $header, $matches))
			{
				$contentType = $matches[1];
				break;
			}
		}
		return $contentType;
	}

	public function get($url, $data = NULL, $header = array())
	{
		$response = $this->curl($url, 'GET', $data, $header);
		return $response['body'];
	}

	public function post($url, $data = NULL, $header = array())
	{
		$response = $this->curl($url, 'POST', $data, $header);
		return $response['body'];
	}

	public function head($url, $data = NULL, $header = array())
	{
		$response = $this->curl($url, 'HEAD', $data, $header);
		$rawHeaders = $response['header'];
		preg_match_all('/^(.*?):(.*?)$/m', $rawHeaders, $matches, PREG_SET_ORDER);
		$headers = array();
		foreach($matches as $match)
		{
			$headers[trim($match[1])] = trim($match[2]);
			$headers[strtolower(trim($match[1]))] = trim($match[2]);
		}
		return $headers;
	}

	private function curl($url, $method = 'GET', $data = NULL, $header = array(), $port = null)
	{
		$parsedUrl = parse_url($url);
		$scheme = @$parsedUrl['scheme'];
		if(!$scheme) $scheme = 'http';
		$url = $scheme . '://' . $parsedUrl['host'];

		if(@$parsedUrl['path']) $url .= $parsedUrl['path'];
		if(@$parsedUrl['port']) $port = $parsedUrl['port'];

		$query = array();

		if(@$parsedUrl['query'])
		{
			parse_str($parsedUrl['query'], $query);
		}

		$post = FALSE;
		if(strtoupper($method) == 'POST')
		{
			$post = TRUE;
		}else
		{
			if($data)
			{
				foreach($data as $k=>$v)
				{
					$query[$k] = $v;
				}
				$data = NULL;
			}
		}


		if(count($query) > 0)
		{
			$url .= '?' . http_build_query($query);
		}

		$ch = curl_init($url);

		curl_setopt($ch, CURLOPT_HEADER, 1);

		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		if(isset($port) and !empty($port))
		{
			curl_setopt($ch, CURLOPT_PORT, $port);
		}

		$isJson = FALSE;
		if(count($header) > 0)
		{
			foreach($header as $v)
			{
				if(preg_match('/content\-type.*?json/i', $v)) $isJson = TRUE;
			}
			curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
		}

		if($post)
		{
			curl_setopt($ch,CURLOPT_POST, 1);
			if(@$data)
			{
				if($isJson)
				{
					$data = json_encode($data);
				}else if(count($data) > 0)
				{
					$data = http_build_query($data);
				}
				curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
			}
		}

			// ob_start();  
			// $out = fopen('php://output', 'w');
			// curl_setopt($ch, CURLOPT_VERBOSE, true);

			// $curl = curl_init();
			// curl_setopt($ch, CURLOPT_STDERR, $out); 


		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		$data = curl_exec($ch);
		$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
		$header = substr($data, 0, $header_size);
		$body = substr($data, $header_size);

		curl_close($ch);

		return array('body'=>$body, 'header'=>$header);
	}


}
