<?php
namespace module\core;
class Server extends slikland\core\pattern\Singleton
{
	function memoryLimit()
	{
		return \slikland\utils\Scale::bytesToMachine(ini_get('memory_limit'));
	}

	function uploadLimit()
	{
		return \slikland\utils\Scale::bytesToMachine(ini_get('upload_max_filesize'));
	}

	function freeSpace()
	{
		return disk_free_space(__DIR__);
	}

	function totalSpace()
	{
		return disk_total_space(__DIR__);
	}

	function memory()
	{
		return memory_get_peak_usage(TRUE);
	}

}