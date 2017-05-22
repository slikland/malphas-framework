<?php
namespace slikland\core;

class AnnotationParser
{

	const BEFORE = -1;
	const AFTER = 1;

	private static $_annotations = array(
		self::BEFORE => array(),
		self::AFTER => array()
	);

	public static function parseAnnotations($class, $method = NULL)
	{
		include_once('vendors/Spyc.php');

		if($method)
		{
			$refl = new \ReflectionMethod($class, $method);
		}else{
			$refl = new \ReflectionClass($class);
		}
		$doc = $refl->getDocComment();
		$doc = preg_replace('/\/\*\*(?:\s*\n)*([\s\S]*?)(?:\n\s*)*\*\//m', '$1', $doc);

		$doc = \slikland\utils\StringUtils::blockTrim($doc) . "\n";
		preg_match_all('/^\@(.*?)(?:\s|$)(?:(?!\@)((?:.*?$)(?:\n\s+.*)*))/ms', $doc, $annotations, PREG_SET_ORDER);

		if(!$annotations || count($annotations) == 0)
		{
			return NULL;
		}

		$arr = array();
		foreach($annotations as $annotation)
		{
			$name = trim($annotation[1]);
			$data = \slikland\utils\StringUtils::blockTrim($annotation[2]);
			if(empty($data))
			{
				$data = FALSE;
			}else{
				$tmpData = FALSE;
				if(($tmpData = @json_decode($data, TRUE)))
				{
					$data = $tmpData;
				}else if($tmpData = @spyc_load($data))
				{
					$data = $tmpData;
				}else
				{
					$data = array(trim($annotation[2]));
				}
				
			}
			$arr[$name] = $data;
		}

		return $arr;
	}

	public static function getAnnotations($class, $method = NULL, $raw = FALSE)
	{
		$parsedAnnotations = self::parseAnnotations($class, $method);
		if($raw)
		{
			return $parsedAnnotations;
		}
		$annotations = array(self::BEFORE => array(), self::AFTER => array());
		foreach($annotations as $k=>&$aOrder)
		{
			foreach(self::$_annotations[$k] as $name=>$callback)
			{
				if(isset($parsedAnnotations[$name]))
				{
					$aOrder[] = array('name'=>$name, 'callback'=>$callback, 'data'=>$parsedAnnotations[$name]);
				}
			}
		}
		return $annotations;
	}

	public static function getData($class, $method, $name)
	{
		$annotations = self::getAnnotations($class, $method, TRUE);
		return @$annotations[$name];
	}

	public static function addAnnotationCallback($annotation, $callback, $order = self::BEFORE)
	{
		if(!is_callable($callback))
		{
			throw new Error($annotation . ' callback is not a callable.');
		}
		if($order != self::BEFORE && $order != self::AFTER)
		{
			$order = self::BEFORE;
		}

		self::$_annotations[$order][$annotation] = $callback;
		return TRUE;
	}

	public static function removeAnnotationCallback($annotation, $order = 0)
	{
		$orders = array(self::BEFORE, self::AFTER);
		if(in_array($order, $orders))
		{
			$orders = array($order);
		}
		foreach($orders as $ord)
		{
			if(isset(self::$_annotations[$ord]) && isset($annotation[$ord][$annotation]))
			{
				unset($annotation[$ord][$annotation]);
			}
		}
		return TRUE;
	}

}
