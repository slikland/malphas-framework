<?php
namespace slikland\fs;
class File
{
	static function isWritable($path)
	{
		return is_writable($path);
	}

	static function mkdir($path, $chmod = 0777)
	{
		if(!file_exists($path))
		{
			self::mkdir(dirname($path), $chmod);
			mkdir($path, $chmod);
		}
		return TRUE;
	}

	static function upload($fileObj, $dir, $name = NULL)
	{
		if(file_exists($fileObj['tmp_name'])){
			if(!$name)
			{
				$name = $fileObj['name'];
			}
			
			$dir = rtrim($dir, '/') . '/';
			self::mkdir($dir);

			if(move_uploaded_file($fileObj['tmp_name'], $dir . $name))
			{
				return $dir.$name;
			}
		}
		return FALSE;
	}

	static function toRelative($url, $rootURL = ROOT_URL)
	{
		if(preg_match('/^https?\:\\/\\//', $url))
		{
			$url = preg_replace('/^https?\:\\/\\//i', '', $url);
			$rootURL = preg_replace('/^https?\:\\/\\//i', '', $rootURL);
			return str_replace($rootURL, '', $url);
		}
		return $url;
	}

	static function toURL($path)
	{
		$path = self::toRelative($path);
		$path = str_replace(ROOT_PATH, '', $path);
		return ROOT_URL . $path;
	}

	/*
	Filter:
		String: "jpg"
		Array: array("jpg", "jpeg", "png")
	*/
	static function listDir($path, $filter = NULL, $excludeRE = '/^\./')
	{
		if(!is_dir($path))
		{
			return NULL;
		}

		$path = preg_replace('/(\/+)?$/', '/', $path);

		if(is_string($filter))
		{
			$filter = array($filter);
		}else if(!is_array($filter))
		{
			$filter = NULL;
		}

		$filterRE = NULL;
		if(count($filter) > 0)
		{
			$filterRE = '/\.('. implode('|', $filter) .')$/i';
		}

		$fileList = array();

		$files = scandir($path);
		foreach($files as $file)
		{
			$filePath = $path . $file;
			if($excludeRE)
			{
				if(preg_match($excludeRE, $file))
				{
					continue;
				}
			}
			if(is_dir($filePath))
			{
				if(is_array($ret = static::listDir($filePath, $filter, $excludeRE)))
				{
					$fileList = array_merge($fileList, $ret);
				}
				continue;
			}
			if($filterRE)
			{
				if(!preg_match($filterRE, $file))
				{
					continue;
				}
			}

			$fileList[] = $filePath;
		}
		return $fileList;
	}


}
