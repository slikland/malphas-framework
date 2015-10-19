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
		return slikland\template\TemplateLoader::load(implode('/', $params));
	}
}

?>