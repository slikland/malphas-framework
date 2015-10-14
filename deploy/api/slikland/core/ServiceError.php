<?php
namespace slikland\core;
class ServiceError extends Exception
{

	public function __construct($message, $code = 0, $data = NULL) {
		$this->data = $data;
		parent::__construct($message, $code);
	}

    public function toObject()
	{
		session_write_close();
		$response = array('error'=>true, 'message'=>self::getMessage(), 'code'=>self::getCode());
		if(isset($this->data) && !empty($this->data))
		{
			$response['data'] = $this->data;
		}
		return $response;
	}
}

?>