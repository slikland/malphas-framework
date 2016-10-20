<?php
namespace slikland\core\pattern;
class Singleton
{
	private static $instance = NULL;
	final public static function getInstance()
	{
		if(!self::$instance)
		{
			$c = static::class;
			self::$instance = new $c;
		}
		return self::$instance;
	}
}
