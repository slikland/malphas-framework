<?php
namespace slikland\core;
class Setting
{
	function __construct()
	{

	}

	public static function get($name)
	{
		$db = db();
		return $db->fetch_one("SELECT value FROM cms_setting WHERE name LIKE ?", array($name));
	}

	public static function getAll($name)
	{
		$db = db();
		if(!preg_match('/%/', $name))
		{
			$name .= '%';
		}
		$values = $db->fetch_all("SELECT name, value FROM cms_setting WHERE name LIKE ?", array($name));
		return $values;
	}

	public static function set($name, $value)
	{
		$db = db();
		if(is_null($value))
		{
			$db->query("DELETE FROM cms_setting WHERE name = ?", array($name));
		}else{
			$db->query("INSERT INTO cms_setting (name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?", array($name, $value, $value));
		}
		return TRUE;
	}
}
