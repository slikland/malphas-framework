<?php
namespace slikland\core;

include_once('DB.php');
include_once('Model.php');
include_once('Controller.php');

class ServiceController
{
	private static $prependAnnotation = array('authenticate'=>'controller\cms\User::checkPermission', 'validate');
	private static $appendAnnotation = array('');

	public static function execute($servicePath = NULL, $data = NULL, $output = TRUE)
	{
		$a = new controller\cms\User();
		if(!$servicePath)
		{
			$servicePath = preg_replace('/\/*$/', '', substr(preg_replace('/\?.*?$/', '', $_SERVER['REQUEST_URI']), strlen(dirname($_SERVER['SCRIPT_NAME']))));
		}
		$service = self::findService($servicePath);
		if($view = slikland\template\TemplateLoader::load($servicePath))
		{
			$service['view'] = $view;
		}
		if(!$service)
		{
			throw new \slikland\error\ServiceError('Service not found');
		}
		
		$response = null;
		try{
			if($service)
			{
				if(array_key_exists('class', $service))
				{
					if($service['cms'])
					{
						if(isset($service['path']))
						{
							\controller\cms\User::checkPermission($service['path']);
						}else
						{
							return;
						}
					}
					$class = new $service['class']();

					if(array_key_exists('method', $service))
					{
						$method = $service['method'];
						if(!$data)
						{
							$data = $_REQUEST;
						}
						$annotations = \slikland\annotation\AnnotationParser::getAnnotations($class, $method, ServiceController::$prependAnnotation);
						if($annotations)
						{
							foreach($annotations as $annotation)
							{
								call_user_func($annotation['func'], $data);
							}
						}
						$params = array_merge($data, array('__path'=>$service['path']), $service['params']);
						$response = $class->$method($params);
					}else if(!isset($service['view']))
					{
						$response['header'] = 'HTTP/1.0 404 Not Found';
					}
				}
				if(isset($service['view'])){
					$response['__view'] = $service['view'];
				}
			}
		}catch(\slikland\error\Error $e)
		{
			$response = $e->toObject();
		}catch(\Exception $e)
		{
			$e = new \slikland\error\ServiceError($e->getMessage());
			$response = $e->toObject();
		}
		if($output)
		{
			self::output($response);
		}else
		{
			return $response;
		}
	}

	private static function output($data)
	{
		if(isset($data['ignore']) && $data['ignore'])
		{
		}else if(isset($data['header']))
		{
			header($data['header']);
			if(isset($data['content']))
			{
				print $data['content'];
			}
		}else if(isset($_GET['jsonp']))
		{
			header('Content-type: text/plain;');
			print $_GET['jsonp'] . '(' . json_encode($data) . ');';
		}else if(isset($_GET['callback']))
		{
			header('Content-type: text/plain;');
			print $_GET['callback'] . '(' . json_encode($data) . ');';
		}else{
			header('Content-type: text/json;');
			print json_encode($data);
		}
	}

	private static function findService($service)
	{
		$service = trim($service, '/');
		$serviceArr = explode('/', $service);
		$methodArr = array();

		$path = 'model/';

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
					$response['path'] = $fileName . '/' . $method;
					if(!class_exists($service))
					{
						return null;
					}
					if(in_array($method, get_class_methods($service)))
					{
						$response['method'] = $method;
						array_shift($methodArr);
					}else if(in_array('_run', get_class_methods($service)))
					{
						$response['method'] = '_run';
					}
					$response['params'] = $methodArr;
				}
				$response['cms'] = (bool)preg_match('/^\/?cms/', $fileName);
				return $response;
			}
			array_unshift($methodArr, array_pop($serviceArr));
		}
		return null;
	}

}

?>