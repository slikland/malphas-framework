<?php
namespace module\net;

class Upload
{
	static $UPLOAD_PATH = 'upload/';
	static $cleaningTemp = FALSE;
	function checkOldTemp()
	{
		if(static::$cleaningTemp) return;
		static::$cleaningTemp = TRUE;
		$db = db();
		$oldItems = $db->fetch_all('SELECT pk_upload id FROM upload WHERE created < DATE_ADD(NOW(), INTERVAL -2 DAY)');
		foreach($oldItems as $item)
		{
			$this->remove($item['id']);
		}
		static::$cleaningTemp = FALSE;
	}

	function start($data)
	{
		$db = db();
		$jsonData = json_encode($data);

		$size = 0;
		foreach($data as $item)
		{
			$size += $item['size'];
		}

		$id = $db->insert('INSERT INTO upload (data, size) VALUES (?, ?)', array($jsonData, $size));
		$uid = uid_encode($id);
		$db->query('UPDATE upload SET name = ? WHERE pk_upload = ?', array($uid, $id));
		$path = DYNAMIC_PATH . static::$UPLOAD_PATH . $uid . '/';
		\slikland\fs\File::mkdir($path, 0777);

		return array('id'=>$uid);
	}

	function saveChunk($uid, $index, $data)
	{
		$path = DYNAMIC_PATH . static::$UPLOAD_PATH . $uid . '/';
		if(!file_exists($path))
		{
			throw new Error('Invalid ID');
		}

		$file = fopen($path . 'chunk', 'a');
		fseek($file, $index);
		fwrite($file, $data);
		fclose($file);
	}

	function complete($uid)
	{
		$this->checkOldTemp();

		$path = DYNAMIC_PATH . static::$UPLOAD_PATH . $uid . '/';
		if(!file_exists($path))
		{
			throw new Error('Invalid ID');
		}

		$db = db();
		$data = $db->fetch_value('SELECT data FROM upload WHERE name = ?', array($uid));
		$config = json_decode($data, TRUE);

		foreach($config as $item)
		{
			\slikland\fs\File::copyChunk($path . 'chunk', $path . $item['name'], $item['size'], $item['init']);
		}

		unlink($path . 'chunk');

		if(preg_match('/\.zip$/', $item['name']))
		{
			$this->unzip($path . $item['name']);
		}
	}

	function remove($id)
	{
		if(!is_numeric($id))
		{
			$id = uid_decode($id);
		}
		if(!$id || empty($id)) return;
		$db = db();
		$uid = $db->fetch_value('SELECT name FROM upload WHERE pk_upload = ?', array($id));
		$path = DYNAMIC_PATH . static::$UPLOAD_PATH . $uid . '/';

		$db = db();
		$db->query('DELETE FROM upload WHERE pk_upload = ?', array($id));
		\slikland\fs\File::remove($path);
	}

	function unzip($zip, $to = NULL)
	{
		$archive = new \ZipArchive();
		$archive->open($zip);
		if(!$to) $to = dirname($zip);

		@$archive->extractTo($to);
		@$archive->close();
		@\slikland\fs\File::remove($zip);
	}

	function get($uid, $url = TRUE)
	{
		if(is_numeric($uid))
		{
			$db = db();
			$uid = $db->fetch_value('SELECT name FROM upload WHERE pk_upload = ?', array($uid));
		}
		$path = DYNAMIC_PATH . static::$UPLOAD_PATH . $uid . '/';
		if(!file_exists($path))
		{
			throw new Error('Invalid ID');
		}
		$files = \slikland\fs\File::listDir($path);
		if($url)
		{
			foreach($files as &$file)
			{
				$file = \slikland\fs\File::toURL($file);
			}
		}
		return array('id'=>$uid, 'path'=>$path, 'files'=>$files);
	}

}