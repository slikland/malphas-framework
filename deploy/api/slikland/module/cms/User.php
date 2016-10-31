<?php
namespace slikland\module\cms;
class User extends \slikland\core\pattern\Singleton
{
	function __construct()
	{
		$this->db = db();
		$this->user = NULL;
	}

	private function getIP()
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

	function checkPermission($permission)
	{
		$user = $this->getCurrent();
		if(empty($permission))
		{
			if(!$user)
			{
				throw new CodedError('permission_error');
			}
		}else{
			if(!in_array($user['role'], $permission))
			{
				throw new CodedError('permission_error');
			}
		}
	}

	function add($name, $email, $password, $role)
	{
		$user = $this->getCurrent();
		if($role < $user['role']) $role = $user['role'];
		if($this->db->fetch_one('SELECT pk_cms_user FROM cms_user WHERE email LIKE "'.$email.'" AND status = 1;'))
		{
			throw new CodedError('user_duplicated_email');
		}
		return $this->db->insert('INSERT INTO cms_user (name, email, pass, fk_cms_role) VALUES (?, ?, ?, ?)', array($name, $email, password($password), $role));
	}

	function edit($id, $name, $email, $password, $role)
	{
		$user = $this->getCurrent();
		if($this->db->fetch_one('SELECT pk_cms_user FROM cms_user WHERE pk_cms_user != '.$id.' AND email LIKE "'.$email.'" AND status = 1;'))
		{
			throw new CodedError('user_duplicated_email');
		}
		if($role < $user['role']) $role = $user['role'];
		$fields = array();
		$fields['name'] = $name;
		$fields['email'] = $email;
		if(isset($password) && !empty($password))
		{
			$fields['password'] = password($password);
		}
		$fields['fk_cms_role'] = $role;
		return $this->db->updateFields('cms_user', $fields, 'pk_cms_user = ' . $id);
	}

	function delete()
	{

	}

	function get($id)
	{
		return $this->db->fetch_one('SELECT cu.pk_cms_user id, cu.fk_cms_role role, cr.name roleName, cu.name name, cu.email email FROM cms_user cu LEFT JOIN cms_role cr ON cu.fk_cms_role = cr.pk_cms_role WHERE pk_cms_user = ' . $id);
	}

	function getRoles()
	{
		$user = $this->getCurrent();
		return $this->db->fetch_all('SELECT pk_cms_role id, name FROM cms_role WHERE pk_cms_role >= ' . $user['role']);
	}

	function getList()
	{
		$user = $this->getCurrent();
		$users = $this->db->fetch_all('SELECT 
				cu.pk_cms_user id, 
				cu.name name, 
				cu.email email, 
				cr.name role,
				cs.last_login last_login
				FROM cms_user cu 
			LEFT JOIN cms_role cr ON cr.pk_cms_role = cu.fk_cms_role
			LEFT JOIN (SELECT t_cs.fk_cms_user, MAX(t_cs.created) last_login FROM cms_session t_cs GROUP BY t_cs.fk_cms_user) cs ON cs.fk_cms_user = cu.pk_cms_user
			WHERE cu.fk_cms_role >= ' . $user['role'] .'
			ORDER BY cr.pk_cms_role ASC, cu.name ASC
		');
		return $users;
	}

	function login($email, $pass)
	{
		$pass = password($pass);
		$id = $this->db->fetch_value('SELECT pk_cms_user FROM cms_user WHERE email LIKE \''.$email.'\' AND pass LIKE \''.$pass.'\' AND status = 1');
		$user = FALSE;
		if($id)
		{
			$this->generateSession($id);
			$user = $this->get($id);
		}
		return $user;
	}

	function logout()
	{
		$this->clearSession();
		return TRUE;
	}

	function isLogged()
	{
		return (Boolean) $this->getSession();
	}

	function getCurrent()
	{
		if($this->user)
		{
			return $this->user;
		}else{
			return $this->getSession();
		}
	}

	function getSessionId()
	{
		$user = $this->getCurrent();
		if(!$user)
		{
			return NULL;
		}
		return uid_decode($user['session']);
	}

	private function generateSession($id)
	{
		$sessionId = $this->db->insert('INSERT INTO cms_session (fk_cms_user, ip, updated) VALUES (?, ?, CURRENT_TIMESTAMP)', array($id, $this->getIP()));
		$sessionUID = uid_encode($sessionId);
		$this->db->query('UPDATE cms_session SET uid = ? WHERE pk_cms_session = ?', array($sessionUID, $sessionId));
		$this->updateSession($sessionUID);
	}

	private function updateSession($uid)
	{
		$numID = uid_decode($uid);
		$updated = FALSE;
		if(is_int($numID))
		{
			if($id = $this->db->fetch_value("SELECT pk_cms_session FROM cms_session WHERE pk_cms_session = {$numID} AND status = 1 AND updated > CURRENT_TIMESTAMP - " . CMS_SESSION_TIMEOUT))
			{
				$this->db->query("UPDATE cms_session SET updated = CURRENT_TIMESTAMP WHERE pk_cms_session = {$id}");
				$_COOKIE['sl_cms_session'] = $uid;
				setcookie('sl_cms_session', $uid, time() + CMS_SESSION_TIMEOUT, '/', $_SERVER['HTTP_HOST'], SECURE, TRUE);
				$updated = TRUE;
			}
		}
		if(!$updated)
		{
			$this->clearSession();
		}

		return $updated;
	}

	private function getSession()
	{
		$id = NULL;
		$userId = NULL;
		if(isset($_COOKIE['sl_cms_session']))
		{
			$id = uid_decode($_COOKIE['sl_cms_session']);
			if(is_int($id)){
				$session = $this->db->fetch_one("SELECT fk_cms_user id, pk_cms_session session FROM cms_session cs LEFT JOIN cms_user cu ON cu.pk_cms_user = cs.fk_cms_user WHERE cu.status = 1 AND cs.pk_cms_session = '{$id}' AND cs.status = 1 AND cs.updated > CURRENT_TIMESTAMP - " . CMS_SESSION_TIMEOUT);
				$userId = $session['id'];
			}
		}
		if(!$userId)
		{
			$this->clearSession();
			$this->user = NULL;
		}else
		{
			$this->updateSession($_COOKIE['sl_cms_session']);
			$this->user = $this->get($userId);
			$this->user['session'] = $_COOKIE['sl_cms_session'];
			return $this->user;
		}
	}

	private function clearSession()
	{
		if(isset($_COOKIE['sl_cms_session']))
		{
			$id = uid_decode($_COOKIE['sl_cms_session']);
			if(is_int($id))
			{
				$this->db->query('UPDATE cms_session SET status = 0 WHERE pk_cms_session = ".$id."');
			}
			unset($_COOKIE['sl_cms_session']);
		}

		setcookie('sl_cms_session', '', time()-1, '/', $_SERVER['HTTP_HOST'], SECURE, TRUE);
		$this->user = NULL;
	}



	public function getLog($data)
	{
		if(!$data)
		{
			$data = array();
		}
		$user = $this->getCurrent();
		if(!isset($data['sort']))
		{
			$data['sort'] = '-created';
		}
		if(isset($data['search']))
		{
			$data['search'] = array('value'=>$data['search'], 'fields'=>'name,action,description,data');
		}
		$data['where'] = array();
		$data['where'][] = 'cu.fk_cms_role >= ' . $user['role'];
		$log = $this->db->getList('
			SELECT cu.name name, cl.action, cl.description, cl.data, cl.created FROM cms_log cl
			LEFT JOIN cms_session cs ON cs.pk_cms_session = cl.fk_cms_session
			LEFT JOIN cms_user cu ON cu.pk_cms_user = cs.fk_cms_user
		', $data, NULL);
		return $log;
	}
}