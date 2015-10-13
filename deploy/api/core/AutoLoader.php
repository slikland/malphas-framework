<?php
include_once('config.php');
function sl_autoloader($class)
{
	if(class_exists($class))
	{
		return TRUE;
	}
	$classParts = explode('_', $class);
	$className = $classParts[count($classParts) -1];
	$found = FALSE;
	if($classParts[0] == 'sl')
	{
		$classPath = implode('/', array_splice($classParts, 1)) . '.php';
		if(file_exists(API_PATH . 'slikland/' . $classPath))
		{
			include_once('slikland/' . $classPath);
			$found = TRUE;
		}

	}
	if(!$found)
	{
		$classPath = str_replace('_', '/', $class) . '.php';
		if(ctype_upper($className[0])){
			if(file_exists(API_PATH . 'controller/' . $classPath))
			{
				include_once('controller/' . $classPath);
				$found = TRUE;
			}
		}else{
			if(file_exists(API_PATH . 'model/' . $classPath))
			{
				include_once('model/' . $classPath);
				$found = TRUE;
			}
		}
	}

	if(!$found)
	{
		if(file_exists(API_PATH . $classPath))
		{
			include_once($classPath);
			$found = TRUE;
		}

		if(!$found)
		{
			$dbt = debug_backtrace();
			if(array_key_exists(1, $dbt) && array_key_exists('file', $dbt[1]))
			{
				$path = dirname(debug_backtrace()[1]['file']) . '/';
				if(file_exists($path . $classPath))
				{
					include_once($path . $classPath);
					$found = TRUE;
				}
			}
		}
	}
	if($found)
	{
		if($class != $className)
		{
			class_alias($className, $class);
		}
	}
	return $found;
}
spl_autoload_register('sl_autoloader');
?>