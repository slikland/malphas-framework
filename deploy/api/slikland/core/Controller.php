<?php
namespace slikland\core;
class Controller{
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