<?php
namespace module\media;

class DynamicFile
{
	static $IMAGE_EXTENSION = array('jpg', 'jpeg', 'png', 'gif');
	function get($slug)
	{
		if(is_array($slug))
		{
			$slug = @$slug['slug'];
		}
		$db = db();
		$item = $db->fetch_one('SELECT pk_dynamic_file id, slug, path, name, extension, created FROM dynamic_file WHERE slug = ?', array($slug));
		if($item)
		{
			$item['uid'] = uid_encode($item['id']);

			if($item['name'] && !empty($item['name']))
			{
				$item['url'] = DYNAMIC_URL . $item['path'] . $item['name'];
				$item['absolute_path'] = DYNAMIC_PATH . $item['path'] . $item['name'];
			}else
			{
				$item['url'] = NULL;
				$item['absolute_path'] = NULL;
			}
		}
		return $item;
	}

	function getURL($slug)
	{
		$data = $this->get($slug);
		return $data['url'];
	}

	function getRelative($slug)
	{
		$data = $this->get($slug);
		$path = \slikland\fs\File::toRelative($data['url']);
		return $path;
	}

	function upload($slug, $path, $extension, $uploadId)
	{
		if(!$uploadId) return;
		$db = db();
		$item = $this->get($slug);
		if(!$item)
		{
			\slikland\fs\File::mkdir(DYNAMIC_PATH . $path);
			$db->insert('INSERT INTO dynamic_file (`slug`, `path`, `extension`) VALUES (?, ?, ?)', array($slug, $path, $extension));
		}
		$item = $this->get($slug);

		try{
			if($uploadId == '__none__')
			{
				if(@$item['absolute_path'] && file_exists($item['absolute_path']))
				{
					$this->remove($slug);
				}
				return NULL;
			}else{

				$uploadModule = get_module('net/Upload');
				$imageModule = get_module('Image');

				$uploadedData = $uploadModule->get($uploadId, FALSE);
				$name = $uploadedData['id'] . '.' . $extension;
				if(in_array(strtolower($extension), static::$IMAGE_EXTENSION))
				{
					$image = $imageModule->getImage($uploadedData['files'][0]);
					$imageModule->save($image, DYNAMIC_PATH . $path . $name);
				}else{
					\slikland\fs\File::move($uploadedData['files'][0], DYNAMIC_PATH . $path . $name);
				}
				if($item['absolute_path'] && file_exists($item['absolute_path']))
				{
					// \slikland\fs\File::remove($item['absolute_path']);
				}

				$uploadModule->remove($uploadId);
				$db->query('UPDATE dynamic_file SET name = ? WHERE pk_dynamic_file = ?', array($name, $item['id']));
			}
		}catch(\Exception $e)
		{
		}
		return $this->get($slug);
	}

	function remove($slug)
	{
		$item = $this->get($slug);
		if($item)
		{
			if($item['absolute_path'] && file_exists($item['absolute_path']))
			{
				// \slikland\fs\File::remove($item['absolute_path']);
			}
			$db = db();
			$db->query('DELETE FROM dynamic_file WHERE pk_dynamic_file = ?', array($item['id']));
		}
	}
}