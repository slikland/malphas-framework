<?php
namespace module\net;
class OAuth1
{
	function setup($endpoint, $key, $secret)
	{
		$this->endpoint = trim($endpoint, '/') . '/';
		$this->key = $key;
		$this->secret = $secret;
	}

	function get($url, $data = array())
	{
		return $this->request('GET', $url, $data);
	}

	function post($url, $data = array())
	{
		return $this->request('POST', $url, $data);
	}

	private function getNonce()
	{
		$mt = microtime();
		$rand = mt_rand();
		return md5($mt . $rand);
	}

	private function request($method, $url, $data)
	{
		$url = $this->endpoint . trim($url, '/');
		$keys = array(
			'oauth_consumer_key'=>$this->key,
			'oauth_nonce'=>$this->getNonce(),
			'oauth_signature_method'=>'HMAC-SHA1',
			'oauth_timestamp'=>(string)time(),
			'oauth_version'=>'1.0',
		);

		$baseString = array_merge($keys, $data);
		ksort($baseString);
		$baseString = $method . '&' . urlencode($url) . '&' . urlencode(http_build_query($baseString));
		// print $baseString;
		$salt = rawurlencode($this->secret) . '&';
		$signature = base64_encode(hash_hmac('sha1', $baseString, $salt, TRUE));

		$keys['oauth_signature'] = $signature;
		ksort($keys);
		$header = array();
		foreach($keys as $k=>$v)
		{
			$header[] = $k . '="' . urlencode($v) . '"';
		}
		$header = implode(', ', $header);

		$request = get_module('net/Request');
		$response = NULL;
		switch($method)
		{
			case 'GET':
				$response = $request->get($url, $data, array("Authorization:Oauth " . $header));
				break;
			case 'POST':
				$response = $request->get($url, $data, array("Authorization:Oauth " . $header));
				break;
			default:
				break;
		}
		if($response)
		{
			$response = json_decode($response, TRUE);
		}
		return $response;
	}

}