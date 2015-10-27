<?php
namespace slikland\utils;
include_once('messages/ValidationMessages.php');
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
			$params = (isset($validationParams[0])?$validationParams[0]:NULL);
			if(!call_user_func_array(array(__CLASS__, $validationFunc), array($value, $params)))
			{
				$response[] = array('field'=>$field, 'message'=>static::getMessage($validation, $params));
			}
		}
		if(count($response) > 0)
		{
			return $response;
		}
		return NULL;
	}

	public static function getMessage($message, $values)
	{
		global $validationMessages;
		if(isset($validationMessages[$message]))
		{
			$message = $validationMessages[$message];
		}
		if(isset($values) && !empty($values))
		{
			foreach($values as $k=>$v)
			{
				$message = str_replace('{' . $k . '}', $v, $message);
			}
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

	static function validate_email($value, $params)
	{
		if(!isset($value) || empty($value))
		{
			return TRUE;
		}
		$regex = '/^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,3})$/'; 
		if(preg_match($regex, $value))
		{
			return TRUE;
		}
		return FALSE;
	}

	static function validate_length($value, $params)
	{
		if(!isset($value) || empty($value))
		{
			return TRUE;
		}
		$min = (isset($params['min']) && is_numeric($params['min']))?$params['min']:0;
		$max = (isset($params['max']) && is_numeric($params['max']))?$params['max']:0;
		$l = strlen($value);
		if($l < $min){
			return FALSE;
		}
		if($max > 0 && $l > $max)
		{
			return FALSE;
		}
		return TRUE;
	}
}
?>