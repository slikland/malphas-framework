<?php
namespace slikland\module\cms;



class CMS
{
	function __construct()
	{
		$this->db = db();
	}

	function getMenu($type = NULL, $parent = 0)
	{
		$userModule = get_module('cms/User');
		$user = $userModule->getCurrent();
		if(!$user)
		{
			return NULL;
		}
		if(!$type)
		{
			$type = 'menu';
		}
		
		$items = $this->db->fetch_all('SELECT pk_cms_interface id, name, path FROM cms_interface WHERE fk_cms_interface = ' . $parent . ' AND `type` LIKE "'.$type.'" AND visible = 1 ORDER BY `order` ASC');
		foreach($items as &$item)
		{
			$childItems = $this->getMenu($type, $item['id']);
			if(!empty($childItems))
			{
				$item['items'] = $childItems;
			}
		}
		return $items;
	}

	function getPages($removeFromMenu = FALSE)
	{
		$rPath = ROOT_PATH . 'cms/templates/pages/';
		$pages = array();
		$files = \slikland\fs\File::listDir($rPath);
		foreach($files as &$file)
		{
			$file = ltrim(str_replace($rPath, '', preg_replace('/\.mara$/', '', $file)), '/');
		}
		$this->db->query('DELETE FROM cms_interface WHERE path NOT IN ("'.implode('","', $files).'")');
		foreach($files as &$file)
		{
			// $file = ltrim(str_replace($rPath, '', preg_replace('/\.mara$/', '', $file)), '/');
			if(!($item = $this->db->fetch_one('SELECT pk_cms_interface id, IF(ISNULL(name),"", name) name, path, `type` FROM cms_interface WHERE path LIKE "'.$file.'"')))
			{
				$this->db->insert('INSERT INTO cms_interface (path, created, visible, `type`) VALUES (?, NOW(), 0, ?)', array($file, 'pages'));
				$item = $this->db->fetch_one('SELECT pk_cms_interface id, IF(ISNULL(name),"", name) name, path, `type` FROM cms_interface WHERE path LIKE "'.$file.'"');
			}
			if($removeFromMenu && $item['type'] != 'pages')
			{
				continue;
			}
			$pages[] = $item;
		}
		// getRoles
		return $pages;
	}

	function updatePages($data, $type = NULL)
	{
		if(isset($data) && isset($data['items']))
		{
			$this->_updatePagesRecursive($data['items'], $type);
		}
	}

	private function _updatePagesRecursive($data, $type, $parent = 0)
	{
		$i = 0;
		foreach($data as $item)
		{
			if(isset($item['id']))
			{
				$this->db->query('UPDATE cms_interface SET fk_cms_interface = ?, name = ?, type = ?, visible = ?, `order` = ? WHERE pk_cms_interface = ' . $item['id'], array($parent, $item['name'], $type, 1, $i++));
				if(isset($item['items']))
				{
					$this->_updatePagesRecursive($item['items'], $type, $item['id']);
				}
			}
		}
	}

}