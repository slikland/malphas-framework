<?php
include_once('config.php');
function sl_autoloader($class, $prevClassName = NULL)
{
	if(class_exists($class))
	{
		return TRUE;
	}

	$classParts = explode('\\', $class);
	$classPath = implode('/', $classParts);

	$dbt = debug_backtrace();

	$paths = array();
	$paths[] = $classPath;

	if(array_key_exists(1, $dbt) && array_key_exists('file', $dbt[1]))
	{
		$localPath = str_replace(str_replace(API_PATH, '', dirname(debug_backtrace()[1]['file']) . '/'), '', $classPath);
		$paths[] = $localPath;
		$paths[] = 'controller/' . $localPath;
		$paths[] = 'model/' . $localPath;
		$paths[] = 'slikland/error/' . $localPath;
	}

	$found = false;
	foreach($paths as $path)
	{
		$fullPath = API_PATH . $path . '.php';
		if(file_exists($fullPath))
		{
			include_once($fullPath);
			$namespacedClass = preg_replace('/\//', '\\', $path);
			if(!class_exists($class))
			{
				class_alias($namespacedClass, $class);
			}
			$found = true;
			break;
		}
	}

	$className = $classParts[count($classParts) - 1];
	if(!$found && class_exists($className))
	{
		// define($className, $class);
		class_alias($className, $class);
		$found = true;
	}
	return $found;
}
spl_autoload_register('sl_autoloader');
?>