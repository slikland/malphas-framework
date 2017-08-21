<?php
namespace slikland\utils;

class DateUtils
{
	public static function formatDate($date)
	{
		$dateArr;
		if(strpos('/', $date) !== FALSE)
		{
			$dateArr = explode('/', $date);
		}else
		{
			$dateArr = explode('-', $date);
		}

		if(strlen($dateArr[0]) == 2)
		{
			$dateArr = array_reverse($dateArr);
		}
		return implode('-', $dateArr);
	}
}
