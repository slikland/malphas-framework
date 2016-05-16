<?php
namespace model;
class test extends Model
{
	function __construct(){

	}

	function test($params)
	{
		$User = $this->getController('cms/User');
		var_dump($User);
		return array(1, 2, 3);
	}
}

?>