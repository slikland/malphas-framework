<?php
namespace module\social;

class Firebase
{

	static $DEFAULT_GROUP = 'broadcast';

	private $_settings = array(
		'topicId' => 'Group ID',
		'client_id' => 'Client ID',
		'authorization_key' => 'Server Authorization Key',
	);

	private $_name = NULL;

	public function name()
	{
		if(!$this->_name)
		{
			$name = (String)__CLASS__;
			$name = preg_replace('/.*?([^\\\\]+)$/', '$1', $name);
			$this->_name = $name;
		}
		return $this->_name;
	}

	function getSettings($fullObject = FALSE)
	{
		$prefix = $this->name();
		$settings = array();
		foreach($this->_settings as $k=>$v)
		{
			if($fullObject)
			{
				$settings[] = array('name'=>$prefix . '-' . $k, 'value'=>Setting::get($prefix . '-' . $k), 'label'=>$v);
			}else{
				$settings[$k] = Setting::get($prefix . '-' . $k);
			}
		}
		return $settings;
	}

	function setSettings($data)
	{
		$prefix = $this->name();
		foreach($this->_settings as $k=>$v)
		{
			$value = @$data[$k];
			Setting::set($prefix . '-' . $k, $value);
		}
	}

	function register($token, $group = 0)
	{
		$requestModule = get_module('net/Request');
		$settings = $this->getSettings();
		$db = db();

		$tokenExists = FALSE;
		if(isset($_COOKIE['FB_token']) && !empty(@$_COOKIE['FB_token']))
		{
			$tokenCookieValue = $_COOKIE['FB_token'];
			preg_match('/^([^\:]+)\:{2}(.*?)$/', $tokenCookieValue, $tokenParts);
			$id = uid_decode($tokenParts[1]);
			$oldToken = $tokenParts[2];
			if($oldToken == $token)
			{
				$tokenExists = TRUE;
			}else{
				$db->query('UPDATE notification_device SET status = 0 WHERE pk_notification_device = ?', array($id));
			}
		}
		$tokenExists = FALSE;

		if(!$tokenExists)
		{
			if(!$db->fetch_value('SELECT 1 FROM notification_device WHERE token = ?', array($token)))
			{
				$ip = \slikland\utils\Net::getIP();
				$notificationDeviceId = $db->insert('INSERT INTO notification_device (token, ip, status) VALUES (?, ?, ?)', array($token, $ip, 1));
				$tokenCookieValue = uid_encode($notificationDeviceId) . '::' . $token;
				$_COOKIE['FB_token'] = $tokenCookieValue;
				setcookie('FB_token', $tokenCookieValue, time() + 60*60*24*365, '/', $_SERVER['HTTP_HOST'], SECURE, TRUE);
			}else{
				$tokenExists = TRUE;
			}
		}


		if($group === 0) $group = self::$DEFAULT_GROUP;
		if($group)
		{
			if(!$tokenExists)
			{
				$requestModule->post('https://iid.googleapis.com/iid/v1/'.$token.'/rel/topics/' . $group, array('a'=>1), array('Content-type: application/json', 'Authorization:key=' . $settings['authorization_key']));
			}
		}else
		{

		}
		return 1;
	}


	function notify($to, $data)
	{
		$this->send($to, $data);
	}

	function broadcast($to, $data)
	{
		$this->send('/topics/' . $to, $data);
	}

	private function send($to, $data)
	{
		$requestModule = get_module('net/Request');
		$settings = $this->getSettings();

		$requestModule->post('https://fcm.googleapis.com/fcm/send', array('data'=>$data, 'to'=>$to), array('Content-type: application/json', 'Authorization:key=' . $settings['authorization_key']));
	}
}