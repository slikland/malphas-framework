<?php
namespace slikland\error;
class Error extends \Exception
{
	private static $ERROR_RANGE = 99;
	protected static $INIT_CODE = 0;
	protected static $ERRORS = array();
	public function __construct($message, $code = 0, $data = NULL) {
		$this->data = $data;
		if(static::$ERRORS)
		{
			$errorMessage = NULL;
			if(is_int($message))
			{
				foreach(static::$ERRORS as $error)
				{
					if($error[0] == $message){
						$errorMessage = $error;
						break;
					}
				}
			}else if(isset(static::$ERRORS[$message]))
			{
				$errorMessage = static::$ERRORS[$message];
			}
			if($errorMessage)
			{
				$code = $errorMessage[0];
				$message = $errorMessage[1];
			}
		}
		$code = static::$INIT_CODE + $code;
		if($code > self::$ERROR_RANGE)
		{
			$code = static::$INIT_CODE;
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