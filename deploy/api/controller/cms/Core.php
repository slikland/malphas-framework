<?php

namespace controller\cms;
class Core
{
	public function getInterface()
	{
		$items = $this->getClassesRecursive();
		return $items;
	}

	private function getClassesRecursive($path = '')
	{
		$files = scandir(API_PATH . 'model/cms/' . $path);
		$result = array();
		foreach($files as $file)
		{
			if(in_array($file, array('.', '..')))
			{
				continue;
			}
			if(is_dir(API_PATH . 'model/cms/' . $path . $file))
			{
				array_merge($result, $this->getClassesRecursive($path . $file . '/'));
				
			}else if(preg_match('/\.php$/i', $file)){
				$filePath = preg_replace('/\//', '\\', '\\' . 'model/cms/' . $path . preg_replace('/\.php/i', '', $file));
				if($classContent = $this->getClassContent($filePath, preg_replace('/\.php$/i', '', $path . $file))){
					$result[] = $classContent;
				}
			}
		}
		return $result;
	}

	private function getClassContent($path, $urlPath)
	{
		$reflection = new \ReflectionClass($path);
		if(!$reflection)
		{
			return NULL;
		}
		$content = array();
		$annotations = \slikland\annotation\AnnotationParser::getAnnotations($path, NULL, array('addToMenu'=>1));
		if(!$annotations)
		{
			return NULL;
		}
		$menuItem = call_user_func_array(array($this, 'setInterfaceData'), $annotations[0]['values']);
		if($reflection->hasmethod('index'))
		{
			$menuItem['url'] = $urlPath;
		}
		$methods = $reflection->getMethods(\ReflectionMethod::IS_PUBLIC);
		$items = array();
		foreach($methods as $method)
		{
			$annotations = \slikland\annotation\AnnotationParser::getAnnotations($path, $method->name, array('addToMenu'=>1));
			if($annotations)
			{
				$item = call_user_func_array(array($this, 'setInterfaceData'), $annotations[0]['values']);
				$item['url'] = $urlPath . '/' . $method->name;
				$items[] = $item;
			}
		}
		$menuItem['items'] = $items;
		return $menuItem;
	}

	private function setInterfaceData($name, $index = 0, $permissions = array())
	{
		return array('name'=>$name);
	}
}

?>