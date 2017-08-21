<?php
namespace slikland\validation;
class Validator
{
	public static function validate($data, $info)
	{
		$validationRoot = '\\validation\\';
		$validation = array();
		if(isset($info['*']))
		{
			$catchAll = $info['*'];
			foreach($data as $k=>$v)
			{
				if(!isset($info[$k]))
				{
					$info[$k] = array();
				}
				$info[$k] = array_merge($info[$k], $catchAll);
			}
			unset($info['*']);
		}
		foreach($info as $k=>$v)
		{
			if(!is_array($v))
			{
				continue;
			}
			$value = @$data[$k];
			foreach($v as $validationName=>$validationData)
			{
				if(is_int($validationName) && is_string($validationData)){
					$validationName = $validationData;
					$validationData = NULL;
				}
				$vName = preg_replace('/^.*?\\.([^\\.]+)$/', '$1', $validationName);
				$cName = $validationRoot . preg_replace('/\\./', '\\\\', preg_replace('/^(.*?)\.[^\.]+$/', '$1', $validationName));

				if(method_exists($cName, $vName) && ($result = @call_user_func(array($cName, $vName), $value, $validationData)) !== TRUE)
				{
					$response = array();
					if(isset($validationData['message']))
					{
						$response['message'] = $validationData['message'];
					}else{
						if(is_bool($result))
						{
							$message = \slikland\core\AnnotationParser::getData($cName, $vName, 'message');
							if(!empty($message))
							{
								if(is_array($message))
								{
									$message = $message[0];
								}
							}
							$response['message'] = $message;
						}elseif(is_string($result))
						{
							$response['message'] = $result;
						}else{
							$response = (array)$result;
						}
					}
					$response['field'] = $k;
					$response['type'] = $validationName;
					$validation[] = $response;
					break;
				}
			}
		}
		if(!empty($validation) && count($validation) > 0)
		{
			throw new Error('validation error', 1001, $validation);
		}
	}
}