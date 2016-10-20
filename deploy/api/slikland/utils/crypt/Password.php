<?php
namespace slikland\utils\crypt;
class Password
{
	public static function encode($password, $key = 'sl')
	{
		return sha1($password . $key) . md5($key . $password);
	}
}