<?php
namespace slikland\utils;
class ObjectUtils
{
	public static function flattenObject($object, $keys = array())
	{
		$response = array();
		foreach($object as $k=>$v)
		{
			$k = array_merge($keys, array($k));
			if(is_array($v))
			{
				$response = array_merge($response, self::flattenObject($v, $k));
			}else
			{
				$response[] = array(
					'key'=>implode('.', $k),
					'keys'=>$k,
					'value'=>$v
				);
			}
		}
		return $response;
	}

	public static function mergeObjects()
	{
		$response = array();
		$args = func_get_args();
		$l = count($args);
		$i = -1;
		while(++$i < $l)
		{
			$o = $args[$i];
			if (is_array($o) || is_object($o))
			{
				foreach($o as $k => $v)
				{
					if(!isset($response[$k]))
					{
						if(is_array($v))
						{
							$v = array_merge(array(), $v);
						}
						$response[$k] = $v;
					}else if(is_array($v))
					{
						$response[$k] = self::mergeObjects($response[$k], $v);
					}else if(!empty($v))
					{
						$response[$k] = $v;
					}
				}
			}
		}

		return $response;
	}

	public static function findInObject($object, $match)
	{
		$matched = TRUE;
		foreach($match as $mk=>$mv)
		{
			if(!isset($object[$mk]) || $object[$mk] != $mv)
			{
				$matched = FALSE;
				break;
			}
		}
		if($matched)
		{
			return $object;
		}

		foreach($object as $v)
		{
			if(is_array($v))
			{
				$ret = self::findInObject($v, $match);
				if($ret)
				{
					return $ret;
				}
			}
		}
		return NULL;
	}

}
