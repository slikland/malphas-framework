<?php
namespace service;
class test
{
	/**
	@cmsUser [0, 1, 2, 3]
	@user [0, 1, 2, 3]
	@method GET
	@log
	*/
	function test($data)
	{
		$db = db();

		$db->fetch_all("SELECT * FROM cms_user WHERE name LIKE ?", array());
		return "<b>TEST</b>";
	}
}