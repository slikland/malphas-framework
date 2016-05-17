<?php
namespace slikland\core;
class Controller{
	private static $instance = NULL;
	public static function getInstance()
	{
		if(!self::$instance)
		{
			self::$instance = new static();
		}
		return self::$instance;
	}

	function __construct()
	{

	}

	function __get($name){
		switch($name)
		{
			case 'db':
				return DB::getInstance();
			default:
				break;
		}
	}

	function getController($name, $singleton = FALSE)
	{
		$name = '\\controller\\' . preg_replace('/^\\*/', '', preg_replace('/\\//', '\\', $name));
		if(class_exists($name))
		{
			if($singleton)
			{
				return $name::getInstance();
			}
			return new $name();
		}
		return NULL;
	}
}

class_alias('\slikland\core\Controller', 'Controller');
?>