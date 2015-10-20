<?php
namespace model;
class user extends Model
{

	/**
	* @authenticate(1, 2, 3)
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