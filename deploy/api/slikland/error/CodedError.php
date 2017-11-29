<?php
namespace slikland\error;
class CodedError extends ServiceError
{
	private static $messages = NULL;
	private static function getErrorMessages()
	{
		if(!self::$messages)
		{
			$codes = file_get_contents(API_PATH . 'messages/error.codes');
			self::$messages = self::parseCodes($codes);
		}
		return self::$messages;
	}

	private static function parseCodes($codes)
	{
		$messages = array();
		$codes = preg_replace('/^[\s\n\r\t]*/', '', $codes);

		$currentCode = 0;
		preg_match_all('/^(?:(\d+)|(?:(\D[^\s]*)\s*:\s*([\'|\"])(.*)\3))/m', $codes, $matches,  PREG_SET_ORDER);
		foreach($matches as $match)
		{
			if(isset($match[1]) && strlen($match[1]) > 0)
			{
				if(is_numeric($match[1]))
				{
					$currentCode = (int)$match[1];
				}
			}else
			{
				$code = $currentCode++;
				$message = $match[4];
				$type = $match[2];
				$m = array('message'=>$message, 'code'=>$code, 'type'=>$type);
				$messages[$code] = $m;
				$messages[$type] = $m;
			}
		}

		return $messages;

	}

	private static function getCodedMessage($type)
	{
		$messages = self::getErrorMessages();
		if(isset($messages[$type]))
		{
			return $messages[$type];
		}
		if(is_numeric($type))
		{
			return array('message'=>'Unexpected error', 'code'=>$type);
		}else{
			return array('message'=>$type, 'code'=>0);
		}
	}

	public function __construct($type, $data = NULL)
	{
		$message = self::getCodedMessage($type);
		parent::__construct($message['message'], $message['code'], $data);
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