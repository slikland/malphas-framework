<?php
namespace slikland\core;
class Logger
{
	function __construct()
	{

	}

	public static function log($action, $description = '', $data = '')
	{
		if(!$action)
		{
			return;
		}
		$db = DB::getInstance();
		$user = \controller\cms\User::getInstance()->getCurrentUser();
		if(!$user)
		{
			return;
		}
		$row = $db->insertFields('cms_log', array('fk_cms_session'=>$user['session'], 'action'=>$action, 'description'=>$description, 'data'=>$data));
	}

	public static function listLog()
	{
		return false;
	}
}
?>