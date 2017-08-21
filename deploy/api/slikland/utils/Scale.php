<?php
namespace slikland\utils;

class Scale
{
	static function bytesToHuman($bytes)
	{
		if(!is_numeric($bytes)) throw new Error('Bytes is not numeric.');
		$units = array('B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB');
		$index = 0;
		$base = 1000;
		$l = count($units);
		while(($bytes > $base) && ($index < $l))
		{
			$bytes /= $base;
			$index++;
		}
		return intval($bytes) . $units[$index];
	}

	static function bytesToMachine($bytes)
	{
		$units = array('', 'K', 'M', 'G', 'T', 'P', 'E');
		$bytes = trim((string)$bytes);
		if(!preg_match('/^([\d\.\,]+)(.)B?$/', $bytes, $match))
		{
			throw new Error('Bytes are not in correct format');
		}
		$numeric = floatval(str_replace(',', '.', $match[1]));
		if(($multipliyer = array_search(strtoupper($match[2]), $units)) === FALSE)
		{
			throw new Error('Bytes are not in correct format');
		}
		return $numeric * pow(1000, $multipliyer);
	}
}