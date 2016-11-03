<?php
namespace slikland\utils\crypt;
class Password
{
	public static function encode($value, $key = NULL)
	{
		if(is_null($key))
		{
			$key = '';
		}
		$key = 'sl_' . $key;
		return strrev(crypt($value, $key)) . md5($key.$value);
	}
}