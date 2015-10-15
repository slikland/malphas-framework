<?php
namespace model;
class view extends Model
{
	function __construct(){

	}

	function _run($params)
	{
		unset($params['__path']);
		$return = array('header'=>'Content-type: text/plain', 'content'=>'');
		if(file_exists(API_PATH . 'view/' . implode('/', $params) . '.tpl'))
		{
			$return['content'] = file_get_contents(API_PATH . 'view/' . implode('/', $params) . '.tpl');
		}
		return $return;
	}
}

?>