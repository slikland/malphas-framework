<?php
namespace controller\cms;
class User extends Controller
{
	public static function checkPermission()
	{

	}

	public function isLogged()
	{
		return 1;
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

	private function getUser($id)
	{
		return $this->db->fetch_one('SELECT cu.pk_cms_user id, cu.fk_cms_role role, cr.name roleName, cu.name name FROM cms_user cu LEFT JOIN cms_role cr ON cu.fk_cms_role = cr.pk_cms_role WHERE pk_cms_user = ' . $id);
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
			$id = $this->db->fetch_value("SELECT fk_cms_user FROM cms_session cs WHERE cs.uid = '{$uid}' AND cs.active = 1 AND cs.updated > CURRENT_TIMESTAMP - " . CMS_SESSION_TIMEOUT);
		}
		if(!$id)
		{
			$this->removeSession();
		}else
		{
			$this->updateSession($uid);
			if($userData)
			{
				return $this->getUser($id);
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
			setcookie('sl_cms_session', $uid, time() + CMS_SESSION_TIMEOUT, '/', $_SERVER['HTTP_HOST']);
			return TRUE;
		}
		return FALSE;
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
}
?>