<?php
namespace slikland\utils;
class Request
{
	public static function loadURL($url, $post = NULL, array $header = array(), $port = null)
	{
		$ch = curl_init($url);

		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		if(isset($port) and !empty($port))
		{
			curl_setopt($ch, CURLOPT_PORT, $port);
		}

		if(count($header) > 0)
		{
			curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
		}

		if($post !== null)
		{
			if(is_array($post)){
				$post = http_build_query($post);
			}
			curl_setopt($ch,CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
		}

		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		$data = curl_exec($ch);
		curl_close($ch);

		return $data;
	}	
}
