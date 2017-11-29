<?php

namespace service;

class service
{
	/**
	@output text
	*/
	function checkIP($data)
	{
		if(!isset($data['token']))
		{
			return;
		}

		$token = $data['token'];
		$token = uid_decode($token);
		$t = time() - $token;
		$t *= $t;
		if($t > 100) return;
		$addr = $_SERVER['SERVER_ADDR'];
		$addr = \slikland\crypt\Philo::encode($addr);

		return $addr;
	}

	/**
	// @output text
	*/
	function update($data)
	{
		if(!isset($data['token']))
		{
			return;
		}

		$token = $data['token'];
		$token = uid_decode($token);

		$lt = Setting::get('last_update_time');
		if($lt == $token) return;

		$t = time() - $token;
		$t *= $t;

		if($t > 10000) return;
		Setting::set('last_update_time', $token);

		file_put_contents(DYNAMIC_PATH . 'urls.php', $data['urls']);
		file_put_contents(DYNAMIC_PATH . 'offerLeadURLs.php', $data['leads']);

		// $contentModule = get_module('ford/Content');
		// $contentModule->generateContent(FALSE);

		$addr = $_SERVER['SERVER_ADDR'];
		$addr = \slikland\crypt\Philo::encode($addr);

		return $addr;

	}

}