<?php
namespace module\media;
class Dynamic extends \slikland\core\pattern\Singleton
{
	function save($path, $temp = FALSE, $local = FALSE)
	{
		$path = str_replace(DYNAMIC_PATH, '', $path);
		$dynamicPath = DYNAMIC_PATH . $path;

		if(!file_exists($dynamicPath)) throw new Error('File doesn\'t exiset');

		$db = db();
		$id = $db->fetch_value('SELECT pk_dynamic FROM dynamic WHERE path = ?', array($path));
		$isLocal = TRUE;
		if(!$local)
		{
			try{
				$s3 = get_module('net/S3');
				$path = $s3->upload($dynamicPath, $path);
				unlink($dynamicPath);
				$isLocal = FALSE;
			}catch(\Exception $e)
			{

			}
		}
		
		if($id)
		{
			$db->query('UPDATE dynamic SET created = NOW(), local = ?, temp = ? WHERE pk_dynamic = ?', array($isLocal, $temp, $id));
		}else
		{
			$id = $db->insert('INSERT INTO dynamic (path, local, temp) VALUES (?, ?, ?)', array($path, $isLocal, $temp));
		}
		return $id;
	}

	function getURL($path)
	{
		$db = db();
		$url = NULL;
		if(is_numeric($path))
		{
			$item = $db->fetch_one('SELECT path, local, temp FROM dynamic WHERE pk_dynamic = ?', array($path));
		}else{
			$path = str_replace(DYNAMIC_PATH, '', $path);
			$item = $db->fetch_one('SELECT path, local, temp FROM dynamic WHERE path = ?', array($path));
		}

		if(!$item){
			if(is_string($path) && file_exists(DYNAMIC_PATH . $path))
			{
				$url = DYNAMIC_URL . $path;
			}
		}else{
			if($item['local'] == 1)
			{
				$url = DYNAMIC_URL . $item['path'];
			}else{
				$s3 = get_module('net/S3');
				$url = $s3->url() . $item['path'];
			}
		}
		return $url;
	}

	function clearTemp($time)
	{
		$db = db();
		$items = $db->fetch_all('SELECT * FROM dynamic WHERE created < (NOW() - INTERVAL 1 DAY) AND temp = 1;', NULL, TRUE);
		if($items && count($items) > 0)
		{
			$s3 = get_module('net/S3');
			$ids = array();
			foreach($items as $item)
			{
				if($item['local'] == 1)
				{
					@unlink(DYNAMIC_PATH . $item['path']);
				}else{
					@$s3->delete($item['path']);
				}
				$ids[] = $item['pk_dynamic'];
			}
			$db->query('DELETE FROM dynamic WHERE pk_dynamic IN ('.implode(',', $ids).')');
		}
	}

	function delete($path)
	{
		$db = db();
		if(is_numeric($path))
		{
			$item = $db->fetch_one('SELECT path, local, temp FROM dynamic WHERE pk_dynamic = ?', array($path));
		}else{
			$item = $db->fetch_one('SELECT path, local, temp FROM dynamic WHERE path = ?', array($path));
		}
		if(!$item) return NULL;
		if($item['local'] == 1)
		{
			@unlink(DYNAMIC_PATH . $item['path']);
		}else{
			$s3 = get_module('net/S3');
			@$s3->delete($item['path']);
		}
		return TRUE;
	}
}