<?php
namespace slikland\utils\crypt;
class Password
{

	private static $chars = [
		'lower'=>'abcdefghijklmnopqrstuvwxyz',
		'uppser'=>'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		'digits'=>'0123456789',
		'symbols'=>'!@#$%^&*()_+-=[]{}|;:?.,~',
	];

	public static function encode($value, $key = NULL)
	{
		if(is_null($key))
		{
			$key = '';
		}
		$key = 'sl_' . $key;
		return strrev(crypt($value, $key)) . md5($key . $value);
	}

	public static function generate($min = 8, $max = 18, $chars = [])
	{
		$charsToUse = [];
		foreach(static::$chars as $k=>$v)
		{
			if(is_numeric($k))
			{
				$k = $v;
			}else{
				if(!$v) continue;
			}
			if(isset(static::$chars[$k]))
			{
				$charsToUse[] = static::$chars[$k];
			}
		}

		if(count($charsToUse) == 0)
		{
			foreach(static::$chars as $k=>$v)
			{
				$charsToUse[] = $v;
			}
		}

		$fullChars = '';
		$selectedChars = [];
		foreach($charsToUse as $chars)
		{
			$i = rand(0, strlen($chars) - 1);
			$selectedChars[] = substr($chars, $i, 1);
			$chars = substr($chars, 0, $i) . substr($chars, $i + 1);
			$fullChars .= $chars;
		}

		$len = rand($min, $max);

		while(count($selectedChars) < $len)
		{
			$i = rand(0, strlen($fullChars) - 1);
			$selectedChars[] = substr($fullChars, $i, 1);
			$fullChars = substr($fullChars, 0, $i) . substr($fullChars, $i + 1);
		}
		shuffle($selectedChars);
		$password = implode($selectedChars);
		return $password;

	}
}