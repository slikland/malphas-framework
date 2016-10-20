<?php
namespace slikland\module;
class Password
{
	public static function encode($value, $key = 'slik')
	{
		var_dump($value);
		$value = strrev(md5($value)) . crypt($value, $key);
	}
}