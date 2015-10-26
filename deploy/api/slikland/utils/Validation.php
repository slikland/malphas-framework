<?php
namespace slikland\utils;
include_once('error/ValidationMessages.php');
class Validation
{
	static function validateServiceParams($values, $path, $data)
	{
		$fields = $values[0];
		$validation = $values[1];
		$validationFunc = 'validate_' . $validation;
		if(!method_exists(__CLASS__, $validationFunc))
		{
			return;
		}
		if(!is_array($fields))
		{
			$fields = array($fields);
		}
		$response = array();
		foreach($fields as $field)
		{
			if(isset($data[$field]))
			{
				$value = $data[$field];
			}else{
				$value = NULL;
			}
			$validationParams = array_splice($values, 2);
			if(!call_user_func_array(array(__CLASS__, $validationFunc), array($value, $validationParams)))
			{
				$response[] = array('field'=>$field, 'message'=>static::getMessage($validation, $validationParams));
			}
		}
		if(count($response) > 0)
		{
			return $response;
		}
		return NULL;
	}

	private static function getMessage($message, $values)
	{
		global $validationMessages;
		if(isset($validationMessages[$message]))
		{
			$message = $validationMessages[$message];
		}
		foreach($values as $k=>$v)
		{
			$message = str_replace('{' . $k . '}', $v, $message);
		}
		return $message;
	}

	// ADD Validations below this line

	static function validate_required($value, $params)
	{
		if(isset($value) && !empty($value)){
			return TRUE;
		}
		return FALSE;
	}
}
?>