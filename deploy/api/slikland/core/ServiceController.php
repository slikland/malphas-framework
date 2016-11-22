<?php
namespace slikland\core;

class ServiceController
{
	public static function execute($servicePath = NULL, $data = NULL, $output = TRUE)
	{
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
			}else{
				$class = new $service['class']();
				$method = $service['method'];
				$annotations = \slikland\core\AnnotationParser::getAnnotations($class, $method);

				$requestHeaders = getallheaders();

				if(isset($annotations['cmsUser']))
				{

				}

				if(isset($annotations['user']))
				{

				}

				if(isset($annotations['permission']))
				{
					$user = get_module('cms/User');
					$user->checkPermission($annotations['permission']);
				}

				$requestMethod = NULL;

				if(isset($annotations['method']))
				{
					$requestMethod = $annotations['method'][0];
				}
				switch (strtoupper($requestMethod))
				{
					case 'GET':
						$data = $_GET;
						break;
					case 'POST':
						if(isset($requestHeaders['Content-Type']) && preg_match('/\/json/i', $requestHeaders['Content-Type']))
						{
							$data = array('data'=>json_decode(file_get_contents('php://input'), TRUE));
						}else{
							$data = $_POST;
						}
						break;
					default:
						$data = $_REQUEST;
						break;
				}

				if(!$data) $data = array();

				if(!empty($_FILES))
				{
					$data = array_merge($data, $_FILES);
				}

				if(isset($service['params'])) $data = array_merge($data, $service['params']);

				if(isset($annotations['validate']))
				{
					\slikland\validation\Validator::validate($data, $annotations['validate']);
				}

				if(isset($annotations['output']))
				{
					$format = @$annotations['output'][0];
					if(isset($annotations['filename']) && !empty($annotations['filename']))
					{
						outputFileName($annotations['filename'][0]);
					}
				}

				$response = $class->$method($data);

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

			}

		}catch(\slikland\error\Error $e)
		{
			// if(DEBUG)
			// {
			// 	var_dump($e);
			// }
			$response = $e->toObject();
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
		throw new \slikland\error\Error('service not found');
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

