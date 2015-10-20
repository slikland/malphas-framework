<?php
namespace controller\cms;
class User extends Controller
{
	public static function checkPermission()
	{

	}

	public function isLogged()
	{
		return 1;
	}

	public function login()
	{
		$this->checkDB();
		return $this->db;
	}

	private function checkDB()
	{
		if(!$this->db->fetch_value('SHOW TABLES LIKE \'cms_user\'')){
			print 2;
			include_once(API_PATH . 'setup/cms.php');
			create_cms_db();
		}
	}
}
?>