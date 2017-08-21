<?php
namespace module\fs;

class FileArchive  extends \slikland\core\pattern\Singleton
{
	function listDir($dir)
	{
		if(!file_exists($dir)) $dir = ROOT_PATH . $dir;
		$files = \slikland\fs\File::listDir($dir);
		foreach($files as &$file)
		{
			$file = str_replace(ROOT_PATH, '/', $file);
		}
		return $files;
	}

	function listModifiedFiles($dir, $since = 0)
	{
		$files = $this->listDir($dir);
		foreach($files as $k=>&$file)
		{
			$t = filemtime(ROOT_PATH . $file);
			if($t < $since){
				unset($files[$k]);
				continue;
			}
			$file = array('path'=>$file, 'modified'=>$t);
		}
		return $files;
	}

	function updateDir($dir)
	{
		$db = db();
		$files = $this->listModifiedFiles($dir);
		$ids = array(0);
		$t = time();
		foreach($files as $file)
		{
			$fileId = $db->fetch_value('SELECT pk_file FROM file WHERE `path` = ?', array($file['path']));
			$modified = $file['modified'];
			$v = uid_encode($modified);
			if($fileId)
			{
				$db->query('UPDATE file SET updated = FROM_UNIXTIME(?), current_version = ?, status = ? WHERE pk_file = ?', array($modified, $v, $fileId, 1));
			}else
			{
				$fileId = $db->insert('INSERT INTO file (`path`, updated, current_version, status) VALUES (?, FROM_UNIXTIME(?), ?, ?)', array($file['path'], $modified, $v, 1));
				var_dump($db->error());
			}
			$ids[] = $fileId;
		}

		$db->query('UPDATE file SET current_version = ?, status = 0, updated = FROM_UNIXTIME(?) WHERE NOT pk_file IN ('.implode(',', $ids).')', array(uid_encode($t), $t));
	}

	function getList($since = 0)
	{
		$db = db();
	}
}