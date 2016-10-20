<?php
namespace slikland\error;
include_once('messages/ErrorCodes.php');
class Error extends \Exception
{
	private static $ERROR_CODES = NULL;
	public function __construct($message, $data = NULL, $code = 0) {
		if(!static::$ERROR_CODES)
		{
			global $errorCodes;
			static::$ERROR_CODES = $errorCodes;
		}
		if(isset(static::$ERROR_CODES[$message]))
		{
			$code = static::$ERROR_CODES[$message][0];
			$message = static::$ERROR_CODES[$message][1];
		}

		$this->data = $data;
		$notification = NULL;
		if(is_string($data) && Notification::exists($data))
		{
			$notification = $data;
		}else if(isset($data['notification']) && Notification::exists($data['notification']))
		{
			$notification = $data['notification'];
		}
		if($notification)
		{
			$this->notification = new Notification($notification);
		}
		parent::__construct($message, $code);
	}

    public function toObject()
	{
		$response = array('error'=>true, 'message'=>self::getMessage(), 'code'=>self::getCode());
		if(isset($this->data) && !empty($this->data))
		{
			$response['data'] = $this->data;
		}
		if(isset($this->notification))
		{
			$response['notification'] = $this->notification;
		}
		return $response;
	}

}

?>