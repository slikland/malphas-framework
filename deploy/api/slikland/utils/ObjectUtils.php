<?php
namespace slikland\utils;
class ObjectUtils
{

	// convert stdobj to array recursive.
	public static function toArray($data)
	{
		return json_decode(json_encode($data), TRUE);
	}

	public static function filterObject($object, $keys)
	{

		$object = static::flattenObject($object);
		$newObject = [];
		foreach($object as $k=>$v)
		{
			foreach($keys as $key)
			{
				if(preg_match('/^'.$key.'(\..*?)?$/', $k))
				{
					continue 2;
				}
			}
			unset($object[$k]);
		}

		return static::unflattenObject($object);
	}

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
				$response[implode('.', $k)] = $v;
			}
		}
		return $response;
	}

	public static function unflattenObject($object)
	{
		$response = array();
		foreach($object as $k=>$v)
		{
			$current = &$response;
			$keys = preg_split('/(?<!\\\\)\./', $k);
			foreach($keys as $k)
			{
				$k = preg_replace('/\\\\\./', '.', $k);
				if(!isset($current[$k]) || !is_array($current[$k])) $current[$k] = [];
				$current = &$current[$k];
			}
			if(is_array($v))
			{
				$v = static::unflattenObject($v);
			}
			$current = $v;
			unset($current);
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

	public static function findInObject($object, $match, $deep = FALSE)
	{
		$matched = FALSE;
		$matches = array();
		if(isAssoc($match))
		{
			foreach($match as $mk=>$mv)
			{
				if(isset($object[$mk]) && $object[$mk] == $mv)
				{
					$matched = TRUE;
					$matches[] = $object;
					break;
				}
			}
		}else{
			foreach($match as $mk)
			{
				if(isset($object[$mk]))
				{
					$matched = TRUE;
					$matches[] = $object;
					break;
				}
			}
		}

		if($deep || (!$deep && !$matched))
		{
			foreach($object as $v)
			{
				if(is_array($v))
				{
					$matches = array_merge($matches, self::findInObject($v, $match, $deep));
				}
			}
		}
		return $matches;
	}

	public static function clearEmpty($object)
	{
		if(is_array($object))
		{
			foreach($object as $k=>$v)
			{
				if(is_array($v))
				{
					$v = static::clearEmpty($v);
				}
				
				if(empty($v))
				{
					unset($object[$k]);
				}
			}
		}
		return $object;
	}

}
