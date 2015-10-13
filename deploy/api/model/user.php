<?php
class user
{

	/**
	* @authenticate("admin", "editor")
	* @validate("email", "email")
	* @validate("name", "maxchar", 10)
	*/

	function test()
	{
		return array(1, 2, 3);
	}
}
?>