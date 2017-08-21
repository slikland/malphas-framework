<?php
namespace slikland\fs;
class File
{
	static function isWritable($path)
	{
		return is_writable($path);
	}

	static function move($from, $to)
	{
		if(!file_exists($from)) throw new Error('File doesn\'t exist.');
		static::remove($to);
		static::mkdir(dirname($to), 0777);
		rename($from, $to);
	}

	static function copy($from, $to)
	{
		if(is_dir($from))
		{
			self::mkdir($to);
			$path = rtrim($from, '/') . '/';
			$files = scandir($path);
			$to = rtrim($to, '/') . '/';
			// $files = static::listDir($path);
			foreach($files as $file)
			{
				if(preg_match('/^\.{1,2}$/', $file)) continue;
				static::copy($path . $file, $to . $file);
			}
		}else{
			copy($from, $to);
		}
	}

	static function remove($path)
	{
		if(!file_exists($path)) return;

		if(is_dir($path))
		{
			$path = rtrim($path, '/') . '/';
			$files = scandir($path);
			// $files = static::listDir($path);
			foreach($files as $file)
			{
				if(preg_match('/^\.{1,2}$/', $file)) continue;
				static::remove($path . $file);
			}
			rmdir($path);
		}else
		{
			unlink($path);
		}
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
		if(!is_string($url)) return $url;
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
		if(!is_string($path)) return $path;
		$path = self::toRelative($path);
		$path = str_replace(ROOT_PATH, '', $path);
		$path = preg_replace('/\/+/', '/', $path);
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
		$path = preg_replace('/\/+/', '/', $path);

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

	static function copyChunk($source, $target, $size = NULL, $offsetSource = 0, $offsetTarget = 0)
	{
		if(!file_exists($source)) throw new Error('Source file doesn\'t exist');
		if(file_exists($target))
		{
			if(!is_writable($target)) throw new Error('Target file is not writeable');
		}else{
			if(!is_writable(dirname($target))) throw new Error('Target file is not writeable');
		}

		$sizeLimit = @ini_get('memory_limit');
		if(!$sizeLimit) $sizeLimit = '128M';
		$sizeLimit = \slikland\utils\Scale::bytesToMachine($sizeLimit) * 0.1;
		if(is_null($size)) $size = filesize($sourceFile);
		$sourceFile = fopen($source, 'r');
		$targetFile = fopen($target, 'a');
		if($size > $sizeLimit)
		{
			$s = 0;
			$l = $sizeLimit;
			while($s < $size)
			{
				if($s + $sizeLimit > $size)
				{
					$l = $size - $s;
				}
				static::_copyChunk($sourceFile, $targetFile, $l, $offsetSource + $s, $offsetTarget + $s);
				$s += $sizeLimit;
			}
		}else{
			static::_copyChunk($sourceFile, $targetFile, $size, $offsetSource, $offsetTarget);
		}

		fclose($sourceFile);
		fclose($targetFile);
	}

	private static function _copyChunk($source, $target, $size, $offsetSource, $offsetTarget)
	{
		fseek($source, $offsetSource);
		fseek($target, $offsetTarget);
		fwrite($target, fread($source, $size));
	}
}
