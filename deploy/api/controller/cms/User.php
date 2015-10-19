<?php
namespace controller\cms;
class User extends Controller
{

	private static $instance = NULL;
	public static function getInstance(){
		if(!self::$instance)
		{
			self::$instance = new DB();
		}
		return self::$instance;
	}

	public static function checkPermission()
	{

	}

	public function isLogged()
	{

	}

	public function login()
	{
		return $this->db;
	}
}
?>