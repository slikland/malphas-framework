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
		return \slikland\utils\Net::getIP();
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

	function getRoleChecksum($id, $role)
	{
		return password($id . '_' . $role, 'role');
	}

	function add($name, $email, $password, $role)
	{
		$user = $this->getCurrent();
		if($role < $user['role']) $role = $user['role'];
		if($this->db->fetch_one('SELECT pk_cms_user FROM cms_user WHERE email LIKE "'.$email.'" AND status = 1;'))
		{
			throw new CodedError('user_duplicated_email');
		}

		try{
			$this->db->query('LOCK TABLES cms_user write');
			$nextID = $this->db->nextId('cms_user');
			$checksum = $this->getRoleChecksum($nextID, $role);
			$insertID = $this->db->insert('INSERT INTO cms_user (pk_cms_user, name, email, pass, fk_cms_role, checksum) VALUES (?, ?, ?, ?, ?, ?)', array($nextID, $name, $email, password($password, $nextID), $role, $checksum));

		}catch(\Exception $e)
		{
			var_dump($e);
		}
		$this->db->query('UNLOCK TABLES;');

		return $insertID;
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
			$fields['pass'] = password($password, $id);
		}
		$fields['fk_cms_role'] = $role;
		$fields['checksum'] = $this->getRoleChecksum($id, $role);
		return $this->db->updateFields('cms_user', $fields, 'pk_cms_user = ' . $id);
	}

	function remove($id)
	{
		$currentUser = $this->getCurrent();
		$userToRemove = $this->get($id);
		if($currentUser['role'] > $userToRemove['role']) throw new CodedError('permission_error');
		if($currentUser['id'] == $userToRemove['id']) throw new CodedError('permission_error');
		return $this->db->query('UPDATE cms_user SET status = 2 WHERE pk_cms_user = ?', array($id));
	}

	function get($id)
	{
		return $this->db->fetch_one('SELECT cu.pk_cms_user id, cu.fk_cms_role role, cr.name roleName, cu.name name, cu.email email FROM cms_user cu LEFT JOIN cms_role cr ON cu.fk_cms_role = cr.pk_cms_role WHERE status = 1 AND pk_cms_user = ' . $id);
	}

	function getRoles()
	{
		$user = $this->getCurrent();
		return $this->db->fetch_all('SELECT pk_cms_role id, name FROM cms_role WHERE pk_cms_role >= ' . $user['role']);
	}

	function getList($data, $role = NULL)
	{
		if(!$data)
		{
			$data = array();
		}
		$user = $this->getCurrent();
		if(!isset($data['sort']))
		{
			$data['sort'] = '-role,name';
		}

		$data['order'] = 'IF(cu.pk_cms_user = '.$user['id'].',0,1)';
		if(isset($data['search']))
		{
			$data['search'] = array('value'=>$data['search'], 'fields'=>'cu.name,cu.email');
		}
		$data['where'] = array();
		$data['where'][] = 'cu.fk_cms_role >= ' . $user['role'];
		$data['where'][] = 'cu.status = 1';
		if(isset($role))
		{
			$data['where'][] = 'cu.fk_cms_role = ' . $role;
		}
		$list = $this->db->getList('
			SELECT 
				cu.pk_cms_user id, 
				cu.name name, 
				cu.email email, 
				cr.name role,
				cs.last_login last_login
				FROM cms_user cu 
			LEFT JOIN cms_role cr ON cr.pk_cms_role = cu.fk_cms_role
			LEFT JOIN (SELECT t_cs.fk_cms_user, MAX(t_cs.created) last_login FROM cms_session t_cs GROUP BY t_cs.fk_cms_user) cs ON cs.fk_cms_user = cu.pk_cms_user
		', $data, 0);
		return $list;
	}

	function login($email, $pass)
	{
		$id = NULL;
		$user = $this->db->fetch_one('SELECT pk_cms_user id, fk_cms_role role FROM cms_user WHERE email LIKE ? AND status = ?', array($email, 1));
		if($user)
		{
			$pass = password($pass, $user['id']);
			$checksum = $this->getRoleChecksum($user['id'], $user['role']);
			$id = $this->db->fetch_value('SELECT pk_cms_user FROM cms_user WHERE email LIKE ? AND pass LIKE ? AND status = ? AND checksum = ?', array($email, $pass, 1, $checksum));
		}
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
				$session = $this->db->fetch_one("SELECT fk_cms_user id, pk_cms_session session, cu.fk_cms_role role, cu.checksum checksum FROM cms_session cs LEFT JOIN cms_user cu ON cu.pk_cms_user = cs.fk_cms_user WHERE cu.status = 1 AND cs.pk_cms_session = '{$id}' AND cs.status = 1 AND cs.updated > CURRENT_TIMESTAMP - " . CMS_SESSION_TIMEOUT);
				$checksum = $this->getRoleChecksum($session['id'], $session['role']);
				if($checksum == $session['checksum'])
				{
					$userId = $session['id'];
				}
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

		// if(isset($data['search']))
		// {
		// 	$data['search'] = array('value'=>$data['search'], 'fields'=>'name,action,description,data');
		// }

		// var_dump($data);

		$db = new \slikland\db\DBHelper('cms_log');
		return $db->paginate($data, 'list', array('cms_user.name','action','description','data'));

		// $data['where'] = array();
		// $data['where'][] = 'cu.fk_cms_role >= ' . $user['role'];
		// $log = $this->db->getList('
		// 	SELECT cu.name name, cl.action, cl.description, cl.data, cl.created, cu.fk_cms_role role FROM cms_log cl
		// 	LEFT JOIN cms_session cs ON cs.pk_cms_session = cl.fk_cms_session
		// 	LEFT JOIN cms_user cu ON cu.pk_cms_user = cs.fk_cms_user
		// ', $data, NULL);
		return $log;
	}
}