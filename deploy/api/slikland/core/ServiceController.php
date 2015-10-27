<?php
namespace slikland\core;

include_once('DB.php');
include_once('Model.php');
include_once('Controller.php');
include_once('Settings.php');
include_once('Logger.php');

class_alias('slikland\core\Settings', 'Settings');

class ServiceController
{
	private static $prependAnnotation = array('permission'=>'controller\cms\User::checkPermission', 'validate'=>'slikland\utils\Validation::validateServiceParams');
	private static $appendAnnotation = array('log'=>'slikland\core\ServiceController::log');

	public static function execute($servicePath = NULL, $data = NULL, $output = TRUE)
	{
		global $logged;
		$logged = false;
		$a = new controller\cms\User();
		if(!$servicePath)
		{
			$servicePath = preg_replace('/\/*$/', '', substr(preg_replace('/\?.*?$/', '', $_SERVER['REQUEST_URI']), strlen(dirname($_SERVER['SCRIPT_NAME']))));
		}
		if($servicePath == '/cms')
		{
			$servicePath = '/cms/index';
		}
		$service = self::findService($servicePath);
		if(!isset($service['method']))
		{
			$service['method'] = 'index';
			$service['params'] = array();
		}
		if(isset($service['path']))
		{
			$servicePath = $service['path'];
		}
		if($view = slikland\template\TemplateLoader::load($servicePath))
		{
			$service['view'] = $view;
		}
		$response = null;
		try{
			if(!$service)
			{
				throw new \slikland\error\Error('service not found');
			}
		
			if($service)
			{
				if(array_key_exists('class', $service))
				{
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
								$return = call_user_func($annotation['func'], $annotation['values'], $service['path'], $data);
								switch($annotation['name'])
								{
									case 'validate':
										if($return)
										{
											if(!isset($validations)) $validations = array();
											$validations = array_merge($validations, $return);
										}
										break;
									default:
										break;
								}
							}
							if(isset($validations) && !empty($validations))
							{
								throw new Error('validation', $validations);
							}
						}
						$params = array_merge($data, array('__path'=>$service['path']), $service['params']);
						$response = $class->$method($params);

						$annotations = \slikland\annotation\AnnotationParser::getAnnotations($class, $method, ServiceController::$appendAnnotation);
						if($annotations)
						{
							foreach($annotations as $annotation)
							{
								call_user_func($annotation['func'], $annotation['values'], $service['path'], $data);
							}
						}
					}else if(!isset($service['view']))
					{
						$response['header'] = 'HTTP/1.0 404 Not Found';
					}
				}
				if(isset($service['view'])){
					$response['__view'] = $service['view'];
				}
			}
			if(!$logged)
			{
				\slikland\core\Logger::log($servicePath, '', json_encode($data));
			}
		}catch(\slikland\error\Error $e)
		{
			$response = $e->toObject();
		}catch(\Exception $e)
		{
			$e = new \slikland\error\Error($e->getMessage());
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

	private static function log($values, $path, $data)
	{
		global $logged;
		if(!$values)
		{
			$values = array();
		}

		if(!isset($values[0]) || $values[0] !== 0)
		{
			if(!isset($values[0]) || is_null($values[0])){
				$values[0] = $path;
			}
			if(!isset($values[1]) || is_null($values[1])){
				$values[1] = '';
			}
			if(!isset($values[2]) || is_null($values[2])){
				$values[2] = json_encode($data);
			}
			\slikland\core\Logger::log($values[0], $values[1], $values[2]);
		}

		$logged = true;
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