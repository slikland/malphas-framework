<?php
namespace slikland\core;
class Model{
	function __construct()
	{

	}

	function __get($name){
		switch($name)
		{
			case 'controller':
				if(!$this->__controller)
				{
					$className = get_called_class();
					$className = preg_replace_callback('/^(\\\\)?model(.*?\\\\)([^\\\\])([^\\\\]*)$/',
						function($m){
							return $m[1] . 'controller' . $m[2] . strtoupper($m[3]) . $m[4];
						},
						$className
					);
					if(class_exists($className))
					{
						$this->__controller = new $className();
					}
				}
				return $this->__controller;
				break;
			default:
				break;
		}
	}

}

class_alias('\slikland\core\Model', 'Model');
?>