<?php
namespace model;
class user
{

	/**
	* @authenticate("admin", "editor")
	* @validate("email", "email")
	* @validate("name", "maxchar", 10)
	* @cache()
	*/

	function test($data = NULL)
	{
		return array(1, 2, 3);
	}
}
?>