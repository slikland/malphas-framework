<?php
namespace slikland\core;

include_once('slikland/core/annotation.php');

class ServiceController
{
	public static function execute($servicePath = NULL, $data = NULL, $output = FALSE)
	{
		if(@$_SERVER['REQUEST_METHOD'] == 'OPTIONS')
		{
			return NULL;
		}
		$response = NULL;
		$format = 'json';
		try{
			if(!$servicePath)
			{
				$servicePath = preg_replace('/\/*$/', '', substr(preg_replace('/\?.*?$/', '', $_SERVER['REQUEST_URI']), strlen(dirname($_SERVER['SCRIPT_NAME']))));
			}
			
			if(!($service = self::findService($servicePath)))
			{
				error(NULL, 404);
			}
			$class = new $service['class']();
			$method = $service['method'];
			$annotations = \slikland\core\AnnotationParser::getAnnotations($class, $method);

			if(!$data)
			{
				$params = array('data' => (array)$_REQUEST);

				if($inputData = file_get_contents('php://input'))
				{
					try{
						$data = json_decode($inputData, TRUE);
						$isJSON = TRUE;
					}catch(\Exception $e)
					{
						$isJSON = FALSE;
					}
					if(!$data)
					{
						$data = array('data'=>$inputData);
						$isJSON = FALSE;
					}
				}
				if(!@$isJSON)
				{
					$data = (array)$_REQUEST;
				}else{
					$data = array_merge((array)$_GET, $data);
				}

				if(isset($service['params']) && !empty($service['params']))
				{
					$data = array_merge($data, $service['params']);
				}

				if(!empty($_FILES))
				{
					$data = array_merge($data, $_FILES);
				}
			}

			$params['data'] = $data;

			foreach($annotations[\slikland\core\AnnotationParser::BEFORE] as $annotation)
			{
				call_user_func_array($annotation['callback'], array($annotation['data'], &$params));
			}

			$response = $class->$method($data);

			foreach($annotations[\slikland\core\AnnotationParser::AFTER] as $annotation)
			{
				call_user_func_array($annotation['callback'], array($annotation['data'], &$params));
			}

			if(isset($annotations['log']))
			{
				$annotation = $annotations['log'];
				$logData = $data;
				$description = '';
				$action = $service['path'];
				if(isAssoc($annotation))
				{
					if(isset($annotation['action']))
					{
						$action = $annotation['action'];
					}
					if(isset($annotation['description']))
					{
						$description = $annotation['description'];
					}
					if(isset($annotation['data']))
					{
						$logData = $annotation['data'];
					}
				}else{
					if(isset($annotation[0]))
					{
						$action = $annotation[0];
					}
					if(isset($annotation[1]))
					{
						$description = $annotation[1];
					}
					if(isset($annotation[2]))
					{
						$logData = $annotation[2];
					}
				}

				log_activity($action, $description, $logData);
			}

			if(isset($params['format']))
			{
				$format = $params['format'];
			}

		}catch(\slikland\error\ServiceError $e)
		{
			// if(DEBUG)
			// {
			// 	var_dump($e);
			// }
			$response = $e->toObject();
		}catch(\Error $e)
		{
			// if(DEBUG)
			// {
			// 	var_dump($e);
			// }
			$response = $e->__toString();
		}catch(Exception $e)
		{
			if(DEBUG)
			{
				var_dump($e);
			}
			$response = $e;
		}
		if($output)
		{
			output($response, $format);
		}else{
			return $response;
		}
	}

	private static function error()
	{
		throw new \slikland\error\ServiceError('service not found');
	}

	private static function findService($service)
	{
		$service = trim($service, '/');
		$serviceArr = explode('/', $service);
		$methodArr = array();

		$path = 'service/';
		if(preg_match('/^(core|setup|cms\/user|cms\/cms)(\/|$)/', $service))
		{
			$path = 'slikland/service/';
		}
		while(count($serviceArr) > 0)
		{
			$fileName = implode('/', $serviceArr);
			if(file_exists(API_PATH . $path . ($fileName) . '.php'))
			{
				include_once(API_PATH . $path . ($fileName) . '.php');
				$service = preg_replace('/\//', '\\', $path) . implode('\\', $serviceArr);
				$response = array('class'=>$service);
				$response['path'] = $fileName;

				if(count($methodArr) > 0)
				{
					$method = $methodArr[0];
				}else{
					$method = 'index';
				}
				$response['path'] = $fileName . '/' . $method;
				if(!class_exists($service))
				{
					if(count($methodArr) > 0){
						return NULL;
					}else{
						array_unshift($methodArr, array_pop($serviceArr));
						continue;
					}
				}
				if(method_exists($service, $method))
				{
					$response['method'] = $method;
					array_shift($methodArr);
				}else if(method_exists($service, 'index'))
				{
					$response['method'] = 'index';
				}
				$response['params'] = $methodArr;

				if(!isset($response['method']))
				{
					return NULL;
				}else{
					return $response;
				}
			}
			array_unshift($methodArr, array_pop($serviceArr));
		}
		return NULL;
	}
}

