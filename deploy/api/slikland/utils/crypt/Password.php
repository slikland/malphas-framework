<?php
namespace slikland\utils\crypt;
class Password
{
	public static function encode($value, $key = 'sl')
	{
		if(is_null($key))
		{
			$key = 'sl';
		}
		return strrev(crypt($value, $key)) . md5($key.$value);
	}
}