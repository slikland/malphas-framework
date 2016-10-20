<?php
namespace slikland\module\cms;

class User
{
	function __construct()
	{
		$this->db = db();
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

	function create()
	{

	}

	function edit()
	{

	}

	function delete()
	{

	}

	function get($id)
	{
		return $this->db->fetch_one('SELECT cu.pk_cms_user id, cu.fk_cms_role role, cr.name roleName, cu.name name, cu.email email FROM cms_user cu LEFT JOIN cms_role cr ON cu.fk_cms_role = cr.pk_cms_role WHERE pk_cms_user = ' . $id);
	}

	function getList()
	{
		// $db = db();
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
		return $this->getSession();
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
	}
}