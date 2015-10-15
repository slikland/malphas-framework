<?php
namespace model;
class user extends Model
{

	/**
	* @authenticate("admin", "editor")
	* @validate("email", "email")
	* @validate("name", "maxchar", 10)
	* @cache()
	*/

	function test($data = NULL)
	{
		var_dump($this->db);
		var_dump($this->controller);
		return array(1, 2, 3);
	}
}
?>