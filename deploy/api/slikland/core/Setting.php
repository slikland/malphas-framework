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
		return $db->fetch_value("SELECT value FROM cms_setting WHERE name LIKE ?", array($name));
	}

	public static function getAll($name)
	{
		$db = db();
		if(!preg_match('/%/', $name))
		{
			$name .= '%';
		}
		$values = $db->fetch_all("SELECT name, value FROM cms_setting WHERE name LIKE ?", array($name), TRUE);
		$items = array();
		foreach($values as $value)
		{
			$items[$value[0]] = $value[1];
		}
		return $items;
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
