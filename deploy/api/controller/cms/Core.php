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
		usort($result, array($this, 'sortMenuItems'));
		return $result;
	}

	private function getClassContent($path, $urlPath)
	{

		$user = \controller\cms\User::getInstance()->getCurrentUser();

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
		$c = 0;
		foreach($methods as $method)
		{
			$annotations = \slikland\annotation\AnnotationParser::getAnnotations($path, $method->name, array('addToMenu'=>1));
			if($annotations)
			{
				$values = $annotations[0]['values'];
				// if()
				if(!isset($values[1]))
				{
					$values[1] = 0;
				}
				$values[1] += $c * 0.001;
				$item = call_user_func_array(array($this, 'setInterfaceData'), $values);
				if($item)
				{
					$item['url'] = $urlPath . '/' . $method->name;
					$items[] = $item;
					$c++;
				}
			}
		}
		usort($items, array($this, 'sortMenuItems'));
		$menuItem['items'] = $items;
		return $menuItem;
	}

	private function sortMenuItems($a, $b)
	{
		if($a['index'] > $b['index'])
		{
			return 1;
		}else if($a['index'] < $b['index'])
		{
			return -1;
		}
		return 0;
	}

	private function setInterfaceData($name, $index = 0, $permissions = array())
	{
		return array('name'=>$name, 'index' => $index);
	}
}

?>