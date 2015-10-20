<?php
namespace slikland\core;
class UIDGenerator
{
	private static $chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	private static $keyLength = 8;
	
	public static function encode($k)
	{
		$key = '';
		$keyIndexes = array();
		$charLength = strlen(self::$chars) - 1;
		while(strlen($key) < self::$keyLength)
		{
			$i = rand(0, $charLength);
			$key .= self::$chars[$i];
			$keyIndexes[] = $i;
		}
		
		$val = $k. '';
		$value = '';
		$l = strlen($val);
		for($i = 0; $i < $l; $i++)
		{
			$p = $i % self::$keyLength;
			$value .= self::$chars[(intval($val[$i]) + $keyIndexes[$p]) % $charLength];
		}
		return $key . $value;
	}
	
	public static function decode($k)
	{
		$charLength = strlen(self::$chars) - 1;
		$i = 0;
		$l = self::$keyLength;
		$key = substr($k, 0, $l);
		$val = substr($k, $l);
		
		$keyIndexes = array();
		for($i = 0; $i < $l; $i++)
		{
			$keyIndexes[] = strpos(self::$chars, $key[$i]);
		}
		
		$l = strlen($val);
		$value = '';
		for($i = 0; $i < $l; $i++)
		{
			$p = $i % self::$keyLength;
			$v = strpos(self::$chars, $val[$i]);
			$v -= $keyIndexes[$p];
			$v = ((($v % $charLength) + $charLength) % $charLength);
			$value .= $v;
		}
		
		return $value;
	}
}
?>