<?php
namespace slikland\core;
class Settings
{
	function __construct()
	{

	}

	public static function get($name)
	{
		$db = DB::getInstance();
		$row = $db->fetch_one("SELECT value FROM cms_setting WHERE name LIKE '{$name}' LIMIT 1", true);
		if($row) return $row[0];
		return NULL;
	}

	public static function set($name, $value)
	{
		$db = DB::getInstance();
		$row = $db->query("INSERT INTO cms_setting (name, value) VALUES ('{$name}', '{$value}') ON DUPLICATE KEY UPDATE value = '{$value}'");
		if($row) return true;
		return false;
	}
}
?>