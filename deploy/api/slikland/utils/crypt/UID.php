<?php
namespace slikland\utils\crypt;
class UID
{
	private static $specialChars = '!@$%^&*()_+#[]{}|?.,<>~0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	private static $chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	private static $keyLength = 8;
	
	public static function encode($k, $useSpecialChars = FALSE)
	{
		if(!$k || is_nan($k))
		{
			return NULL;
		}
		$chars = self::$chars;
		if($useSpecialChars) $chars = self::$specialChars;

		$key = '';
		$keyIndexes = array();
		$charLength = strlen($chars) - 1;
		while(strlen($key) < self::$keyLength)
		{
			$i = rand(0, $charLength);
			$key .= $chars[$i];
			$keyIndexes[] = $i;
		}
		
		$val = $k. '';
		$value = '';
		$l = strlen($val);
		for($i = 0; $i < $l; $i++)
		{
			$p = $i % self::$keyLength;
			$value .= $chars[(intval($val[$i]) + $keyIndexes[$p]) % $charLength];
		}
		return $key . $value;
	}
	
	public static function decode($k, $useSpecialChars = FALSE)
	{
		if(!is_string($k)) return NULL;
		$chars = self::$chars;
		if($useSpecialChars) $chars = self::$specialChars;
		$charLength = strlen($chars) - 1;
		$i = 0;
		$l = self::$keyLength;
		$key = substr($k, 0, $l);
		$val = substr($k, $l);
		if(strlen($key) < $l) return NULL;
		
		$keyIndexes = array();
		try{
			for($i = 0; $i < $l; $i++)
			{
				$keyIndexes[] = strpos($chars, $key[$i]);
			}
		}catch(\Exception $e)
		{
			return NULL;
		}
		
		$l = strlen($val);
		$value = '';
		for($i = 0; $i < $l; $i++)
		{
			$p = $i % self::$keyLength;
			$v = strpos($chars, $val[$i]);
			$v -= $keyIndexes[$p];
			$v = ((($v % $charLength) + $charLength) % $charLength);
			$value .= $v;
		}

		if(!is_numeric($value) || is_nan($value))
		{
			$value = NAN;
		}else{
			$value = (int) $value;
		}
		
		return $value;
	}
}