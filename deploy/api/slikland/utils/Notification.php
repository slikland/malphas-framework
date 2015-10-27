<?php
namespace slikland\utils;
include_once('messages/NotificationMessages.php');
class Notification extends \ArrayObject
{

	public static function exists($message)
	{
		global $notificationMessages;
		return isset($notificationMessages[$message]);
	}

	public function __construct($message, $values = NULL, $type = 3, $timeout = 0, $delay = 0) {
		global $notificationMessages;
		$this['message'] = $message;
		$this['type'] = $type;
		$this['timeout'] = $timeout;
		$this['delay'] = $delay;
		if(isset($notificationMessages[$message]))
		{
			foreach($notificationMessages[$message] as $k=>$v)
			{
				$this[$k] = $v;
			}
		}
		if(!$this['timeout']) unset($this['timeout']);
		if(!$this['delay']) unset($this['delay']);
		$this['message'] = translate($this['message'], $values);
	}
}
?>