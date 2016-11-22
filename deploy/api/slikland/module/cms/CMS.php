<?php
namespace slikland\module\cms;



class CMS
{
	function __construct()
	{
		$this->db = db();
	}

	function getMenu($type = NULL, $parent = 0, $withRoles = FALSE)
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

		if(!$withRoles)
		{
			$items = $this->db->fetch_all('SELECT pk_cms_interface id, name, path FROM cms_interface ci LEFT JOIN cms_interface_role cir ON cir.fk_cms_interface = ci.pk_cms_interface WHERE ci.fk_cms_interface = ? AND `type` LIKE ? AND cir.fk_cms_role = ? AND visible = 1 ORDER BY `order` ASC', array($parent, $type, $user['role']));
		}else{
			$items = $this->db->fetch_all('SELECT pk_cms_interface id, name, path FROM cms_interface ci WHERE ci.fk_cms_interface = ? AND `type` LIKE ? AND visible = 1 ORDER BY `order` ASC', array($parent, $type));
		}

		foreach($items as &$item)
		{
			$childItems = $this->getMenu($type, $item['id'], $withRoles);
			if(!empty($childItems))
			{
				$item['items'] = $childItems;
			}
			if($withRoles)
			{
				$item['roles'] = $this->getPageRoles($item['id']);
			}
		}
		return $items;
	}

	function getPageRoles($pageId)
	{
		return $this->db->fetch_all('SELECT
				cr.pk_cms_role id, cr.name name, NOT(ISNULL(cir.pk_cms_interface_role)) selected FROM cms_role cr
			LEFT JOIN cms_interface_role cir ON cir.fk_cms_role = cr.pk_cms_role AND cir.fk_cms_interface = ?
		', array($pageId));
	}

	function getPages($removeFromMenu = FALSE, $withRoles = FALSE)
	{
		$userModule = get_module('cms/User');
		$user = $userModule->getCurrent();
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
			if(!($item = $this->db->fetch_one('SELECT pk_cms_interface id, IF(ISNULL(name),"", name) name, path, `type` FROM cms_interface WHERE path LIKE "'.$file.'"')))
			{
				$this->db->insert('INSERT INTO cms_interface (path, created, visible, `type`) VALUES (?, NOW(), 0, ?)', array($file, 'pages'));
				$item = $this->db->fetch_one('SELECT pk_cms_interface id, IF(ISNULL(name),"", name) name, path, `type` FROM cms_interface WHERE path LIKE "'.$file.'"');
			}
			if($withRoles)
			{
				$item['roles'] = $this->getPageRoles($item['id']);
			}else{
				if(!$this->db->fetch_one('SELECT 1 FROM cms_interface_role WHERE fk_cms_interface = ? AND fk_cms_role = ?', array($item['id'], $user['role'])))
				{
					continue;
				}
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
				if(isset($item['role']) && !empty($item['role']))
				{
					$roles = implode(', ', $item['role']);
					$this->db->query('DELETE FROM cms_interface_role WHERE fk_cms_interface = ? AND fk_cms_role NOT IN ('.$roles.')', array($item['id']));
					foreach($item['role'] as $role)
					{
						if(!$this->db->fetch_one('SELECT 1 FROM cms_interface_role WHERE fk_cms_interface = ? AND fk_cms_role = ?', array($item['id'], $role)))
						{
							$this->db->insert('INSERT INTO cms_interface_role (fk_cms_interface, fk_cms_role) VALUES (?, ?)', array($item['id'], $role));
						}
					}
				}else{
					$this->db->query('DELETE FROM cms_interface_role WHERE fk_cms_interface = ?', array($item['id']));
				}
				if(isset($item['items']))
				{
					$this->_updatePagesRecursive($item['items'], $type, $item['id']);
				}
			}
		}
	}

}