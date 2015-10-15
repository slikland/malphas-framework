<?php
namespace controller\cms;
class User extends Controller
{
	public static function checkPermission()
	{

	}

	public function login()
	{
		return $this->db;
	}
}
?>