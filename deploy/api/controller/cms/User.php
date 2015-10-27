<?php
namespace controller\cms;
class User extends Controller
{
	public static function checkPermission($values, $path, $data)
	{
		$user = self::getInstance()->getCurrentUser();
		if(!$user)
		{
			throw new Error('not logged');
		}
		if(isset($values[0]) && !in_array($user['role'], $values[0]))
		{
			throw new Error('no permission');
		}
	}

	public function isLogged()
	{
		if($this->getCurrentUser())
		{
			return TRUE;
		}
		return FALSE;
	}

	public function login($user, $pass)
	{
		$this->checkDB();
		$id = $this->db->fetch_value('SELECT pk_cms_user FROM cms_user WHERE email LIKE \''.$user.'\' AND pass LIKE PASSWORD(\''.$pass.'\') AND status = 1');
		if($id)
		{
			$this->db->query('UPDATE cms_session SET active = 0 WHERE fk_cms_user = '. $id);
			$insert = $this->db->insert('INSERT INTO cms_session (fk_cms_user, ip, updated) VALUES (?, ?, CURRENT_TIMESTAMP)', array($id, $this->getUserIP()));
			$uid = \slikland\core\UIDGenerator::encode($insert);
			$this->db->query('UPDATE cms_session SET uid = ? WHERE pk_cms_session = ?', array($uid, $insert));
			$this->updateSession($uid);
		}

		return $this->getUser($id);
	}

	public function getCurrentUser()
	{
		if(!$this->user)
		{
			$this->user = $this->getSession(TRUE);
		}
		return $this->user;
	}

	public function getUser($id)
	{
		return $this->db->fetch_one('SELECT cu.pk_cms_user id, cu.fk_cms_role role, cr.name roleName, cu.name name, cu.email email FROM cms_user cu LEFT JOIN cms_role cr ON cu.fk_cms_role = cr.pk_cms_role WHERE pk_cms_user = ' . $id);
	}

	public function logout()
	{
		$this->removeSession();
		return TRUE;
	}

	public function getSession($userData = true)
	{
		$id = NULL;
		if(isset($_COOKIE['sl_cms_session']))
		{
			$uid = $_COOKIE['sl_cms_session'];
			$session = $this->db->fetch_one("SELECT fk_cms_user id, pk_cms_session session FROM cms_session cs LEFT JOIN cms_user cu ON cu.pk_cms_user = cs.fk_cms_user WHERE cu.status = 1 AND cs.uid = '{$uid}' AND cs.active = 1 AND cs.updated > CURRENT_TIMESTAMP - " . CMS_SESSION_TIMEOUT);
			$id = $session['id'];
			$sessionId = $session['session'];
		}
		if(!$id)
		{
			$this->removeSession();
		}else
		{
			$this->updateSession($uid);
			if($userData)
			{
				$this->user = $this->getUser($id);
				$this->user['session'] = $sessionId;
				return $this->user;
			}else{
				return TRUE;
			}
		}
	}

	private function removeSession()
	{
		if(isset($_COOKIE['sl_cms_session']))
		{
			unset($_COOKIE['sl_cms_session']);
		}
		setcookie('sl_cms_session', '', time()-1, '/', $_SERVER['HTTP_HOST']);
	}

	private function updateSession($uid)
	{
		if($id = $this->db->fetch_value("SELECT pk_cms_session FROM cms_session WHERE uid = '{$uid}' AND active = 1 AND updated > CURRENT_TIMESTAMP - " . CMS_SESSION_TIMEOUT))
		{
			$this->db->query('UPDATE cms_session SET updated = CURRENT_TIMESTAMP WHERE pk_cms_session = ?', array($id));
			$_COOKIE['sl_cms_session'] = $uid;
			setcookie('sl_cms_session', $uid, time() + CMS_SESSION_TIMEOUT, '/', $_SERVER['HTTP_HOST']);
			return TRUE;
		}
		return FALSE;
	}

	public function getRoles($minRole = 0)
	{
		return $this->db->fetch_all('SELECT pk_cms_role value, name name FROM cms_role WHERE pk_cms_role >= '.$minRole.' ORDER BY pk_cms_role', FALSE);
	}

	private function getUserIP()
	{
		$ipaddress = '';
		if (isset($_SERVER['HTTP_CLIENT_IP']))
			$ipaddress = $_SERVER['HTTP_CLIENT_IP'];
		else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
			$ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
		else if(isset($_SERVER['HTTP_X_FORWARDED']))
			$ipaddress = $_SERVER['HTTP_X_FORWARDED'];
		else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
			$ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
		else if(isset($_SERVER['HTTP_FORWARDED']))
			$ipaddress = $_SERVER['HTTP_FORWARDED'];
		else if(isset($_SERVER['REMOTE_ADDR']))
			$ipaddress = $_SERVER['REMOTE_ADDR'];
		else
			$ipaddress = 'UNKNOWN';
		return $ipaddress;
	}

	private function checkDB()
	{
		if(!$this->db->fetch_value('SHOW TABLES LIKE \'cms_user\'')){
			include_once(API_PATH . 'setup/cms.php');
			create_cms_db();
		}
	}

	public function getUserList()
	{
		$user = $this->getCurrentUser();
		return $this->db->fetch_all('SELECT cu.pk_cms_user id, cu.name name, cu.email email, cr.name role  FROM cms_user cu LEFT JOIN cms_role cr ON cu.fk_cms_role = cr.pk_cms_role WHERE cu.fk_cms_role >= '. $user['role'] .' AND status = 1;');
	}

	public function getLog($data)
	{
		if(isset($data['search']))
		{
			$data['search'] = array('fields'=>array('cu.name','cl.action','cl.description','cl.data'), 'value'=>$data['search']);
		}
		$data['pagination'] = array('index'=>0, 'numItems'=>20);
		if(isset($data['_index']))
		{
			$data['pagination']['index'] = $data['_index'];
		}
		return $this->db->getList('SELECT cl.action, IF(ISNULL(cl.description) OR LENGTH(cl.description) = 0, \' \', cl.description) description, IF(ISNULL(cl.data) OR LENGTH(cl.data) = 0, \' \', cl.data) data, cl.created created, cu.name `user` FROM cms_log cl LEFT JOIN cms_session cs ON cl.fk_cms_session = cs.pk_cms_session LEFT JOIN cms_user cu ON cs.fk_cms_user = cu.pk_cms_user', $data);
	}

	public function editUser($data)
	{
		if(isset($data['pass']))
		{
			$data['pass'] = 'PASSWORD(' . $data['pass'] . ')';
		}
		if(isset($data['role']))
		{
			$data['fk_cms_role'] = $data['role'];
			unset($data['role']);
		}
		if(isset($data['id']))
		{
			$id = $data['id'];
			unset($data['id']);
			return $this->db->updateFields('cms_user', $data, 'pk_cms_user = ' . $id);
		}else
		{
			return $this->db->insertFields('cms_user', $data);
		}
	}

	public function removeUser($id)
	{
		return $this->db->query('UPDATE cms_use SET status = 0 WHERE pk_cms_user = \"'.$id.'\"');
	}
}
?>