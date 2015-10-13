<?php
class AnnotationParser
{
	public static function getAnnotations($class, $method, $filter = NULL)
	{
		$refl = new ReflectionMethod($class, $method);
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
			if(!$filter || ($filter && in_array($name, $filter)))
			{
				$arr[] = array('name'=>$name, 'values'=>json_decode('[' . $annotation[2] . ']'));
			}
		}
		return $arr;
	}
}
?>