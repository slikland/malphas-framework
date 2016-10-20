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
		$data = json_encode(static::removePasswords(json_decode($data, true)));
		$row = $db->insertFields('cms_log', array('fk_cms_session'=>$user['session'], 'action'=>$action, 'description'=>$description, 'data'=>$data));
	}

	private static function removePasswords($data)
	{
		if(isset($data) && !is_null($data) && is_array($data))
		{
			foreach($data as $k=>&$v)
			{
				if(preg_match('/^pass(word)?/i', $k))
				{
					$v = '*';
				}else if(is_array($v))
				{
					$v = static::removePasswords($v);
				}
			}
		}
		return $data;
	}

	public static function listLog()
	{
		return false;
	}
}
?>