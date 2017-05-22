<?php
namespace slikland\utils;
class ArrayUtils
{
	public static function flatten($array)
	{
		$response = array();
		foreach($array as $item)
		{
			if(is_array($item))
			{
				$items = $this->flatten($item);
				$response = array_merge($response, $items);
			}else{
				$response[] = $item;
			}
		}
		return $response;

	}
}