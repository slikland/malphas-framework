<?php
namespace slikland\annotation;

class AnnotationParser
{
	public static function getAnnotations($class, $method = NULL, $filters = NULL)
	{
		if($method)
		{
			$refl = new \ReflectionMethod($class, $method);
		}else{
			$refl = new \ReflectionClass($class);
		}
		$doc = $refl->getDocComment();
		preg_match_all('/\*\s*@(\w+)(?:\((.*?)\))?$/m', $doc, $annotations, PREG_SET_ORDER);
		if(!$annotations || count($annotations) == 0)
		{
			return NULL;
		}
		$arr = array();
		foreach($annotations as $annotation)
		{
			$name = $annotation[1];
			if(!$filters || ($filters && array_key_exists($name, $filters)))
			{
				$arr[] = array('name'=>$name, 'values'=>json_decode('[' . $annotation[2] . ']'), 'func'=>$filters[$name]);
			}
		}
		return $arr;
	}
}
?>