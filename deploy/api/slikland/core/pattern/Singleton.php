<?php
namespace slikland\core\pattern;
abstract class Singleton
{
	protected static $instances = array();
	public static function getInstance()
	{
		$class = get_called_class();
		if(!@self::$instances[$class])
		{
			self::$instances[$class] = new $class;
		}
		return self::$instances[$class];
	}
}
