<?php
namespace controller\cms;
class User extends Controller
{
	public static function checkPermission($values, $path, $data)
	{
		$user = self::getInstance()->getCurrentUser();
		if(!$user)
		{
			throw new AuthenticationError('not logged');
		}
		if(isset($values[0]) && !in_array($user['role'], $values[0]))
		{
			throw new AuthenticationError('no permission');
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
		$id = $this->db->fetch_value('SELECT pk_cms_user FROM cms_user WHERE email LIKE \''.$user.'\' AND pass LIKE PASSWORD(\''.$pass.'\')');
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
			$session = $this->db->fetch_one("SELECT fk_cms_user id, pk_cms_session session FROM cms_session cs WHERE cs.uid = '{$uid}' AND cs.active = 1 AND cs.updated > CURRENT_TIMESTAMP - " . CMS_SESSION_TIMEOUT);
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

	public function getRoles()
	{
		return $this->db->fetch_all('SELECT pk_cms_role value, name name FROM cms_role ORDER BY pk_cms_role', FALSE);
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
			print 2;
			include_once(API_PATH . 'setup/cms.php');
			create_cms_db();
		}
	}

	public function getUserList()
	{
		$user = $this->getCurrentUser();
		return $this->db->fetch_all('SELECT cu.pk_cms_user id, cu.name name, cu.email email, cr.name role  FROM cms_user cu LEFT JOIN cms_role cr ON cu.fk_cms_role = cr.pk_cms_role WHERE cu.fk_cms_role >= '. $user['role'] .';');
	}

	public function getLog($data)
	{
		return $this->db->fetch_all('SELECT cl.action, IF(ISNULL(cl.description) OR ISEMPTY(cl.description), \' \', cl.description) description, IF(ISNULL(cl.data) OR ISEMPTY(cl.data), \' \', cl.data) data, cl.created created, cu.name `user` FROM cms_log cl LEFT JOIN cms_session cs ON cl.fk_cms_session = cs.pk_cms_session LEFT JOIN cms_user cu ON cs.fk_cms_user = cu.pk_cms_user ORDER BY cl.created DESC');
	}
}
?>