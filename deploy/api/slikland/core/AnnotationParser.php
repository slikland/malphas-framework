<?php
namespace slikland\core;

class AnnotationParser
{
	public static function getAnnotations($class, $method = NULL)
	{
		if($method)
		{
			$refl = new \ReflectionMethod($class, $method);
		}else{
			$refl = new \ReflectionClass($class);
		}
		$doc = $refl->getDocComment();
		$doc = preg_replace('/\/\*\*(?:\s*\n)*([\s\S]*?)(?:\n\s*)*\*\//m', '$1', $doc);

		$doc = \slikland\utils\StringUtils::blockTrim($doc);
		// ^\@(.*?)(?:\s|$)((?:.*?$)?(?:^\s+.*?$)*)
		preg_match_all('/^\@(.*?)(?:\s|$)((?:.*?$)(?:\n\s+.*)*)/m', $doc, $annotations, PREG_SET_ORDER);
		if(!$annotations || count($annotations) == 0)
		{
			return NULL;
		}
		include_once('vendors/Spyc.php');
		$arr = array();
		foreach($annotations as $annotation)
		{
			$name = trim($annotation[1]);
			$data = spyc_load($annotation[2]);
			$arr[$name] = $data;
		}

		return $arr;
	}

	public static function getData($class, $method, $name)
	{
		$annotations = self::getAnnotations($class, $method);
		return @$annotations[$name];
	}

}
