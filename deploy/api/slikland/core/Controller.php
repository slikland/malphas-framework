<?php
namespace slikland\core;
class Controller{
	private static $instance = NULL;
	public static function getInstance()
	{
		if(!self::$instance)
		{
			// var_dump(__CLASS__);
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

}

class_alias('\slikland\core\Controller', 'Controller');
?>