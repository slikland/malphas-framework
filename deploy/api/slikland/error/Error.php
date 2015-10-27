<?php
namespace slikland\error;
include_once('error/ErrorCodes.php');
class Error extends \Exception
{
	private static $ERROR_CODES = NULL;
	public function __construct($message, $data = NULL, $code = 0) {
		if(!static::$ERROR_CODES)
		{
			global $errorCodes;
			static::$ERROR_CODES = $errorCodes;
		}
		$this->data = $data;
		if(isset(static::$ERROR_CODES[$message]))
		{
			$code = static::$ERROR_CODES[$message][0];
			$message = static::$ERROR_CODES[$message][1];
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
		return $response;
	}

}

?>