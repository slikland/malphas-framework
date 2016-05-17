<?php
namespace model;
class test extends Model
{
	function __construct(){

	}

	function test($params)
	{
		$User = $this->getController('cms/User');
		return array(1, 2, 3);
	}
}

?>