<?php
class ServiceController
{

	private static $prependAnnotation = array('authenticate', 'validate');
	private static $appendAnnotation = array('');

	public static function execute($service = NULL, $data = NULL, $output = TRUE)
	{
		if(!$service)
		{
			$service = substr(preg_replace('/\?.*?$/', '', $_SERVER['REQUEST_URI']), strlen(dirname($_SERVER['SCRIPT_NAME'])));
		}
		$service = self::findService($service);
		if(!$service)
		{
			throw new ServiceError('Service not found');
		}
		$response = null;
		try{
			if($service)
			{
				if(array_key_exists('class', $service))
				{
					if(isset($service['cms']) && $service['cms'])
					{
						if(isset($service['path']))
						{
							$this->checkPermissions($service['path']);
						}else
						{
							return;
						}
					}
					$class = new $service['class']();

					if(array_key_exists('method', $service))
					{
						$method = $service['method'];
						$annotations = sl_annotation_AnnotationParser::getAnnotations($class, $method, ServiceController::$prependAnnotation);
						if($annotations)
						{
							foreach($annotations as $annotation)
							{
								var_dump($annotation);
							}
						}
						if(!$data)
						{
							$data = $_REQUEST;
						}
						$params = array_merge($data, array('__path'=>$service['path']), $service['params']);
						$response = $class->$method($params);
					}else
					{
						$response['header'] = 'HTTP/1.0 404 Not Found';
					}
				}
			}
		}catch(ServiceError $e)
		{
			$response = $e->toObject();
		}catch(Exception $e)
		{
			$e = new ServiceError($e->getMessage());
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

	private static function checkPermissions($path)
	{
		global $db;
		global $user;
		$path = preg_replace('/^(?:\/|cms)*/', '', $path);

		$roles = $db->fetch_all("SELECT crc.fk_cms_role FROM cms_role_content crc LEFT JOIN cms_content cc ON cc.pk_cms_content = crc.fk_cms_content WHERE cc.path = '{$path}';", TRUE);
		if(count($roles) == 0)
		{
			return TRUE;
		}
		$roles = array_map('current', $roles);
		@include_once('model/cms/CMSUser.php');
		$retries = 3;
		$user = NULL;
		while($retries-- > 0)
		{
			if($user = CMSUser::getInstance()->checkSession())
			{
				$user->getSession();
				if($user->logged)
				{
					if(in_array($user->role, $roles))
					{
						return TRUE;
					}
				}
			}
			usleep(10);
		}
		throw new Exception('No permission');
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
		$serviceArr = explode('/', $service);
		$methodArr = array();

		$path = API_PATH . 'model/';

		while(count($serviceArr) > 0)
		{
			$fileName = implode('/', $serviceArr);
			if(file_exists($path . ($fileName) . '.php'))
			{
				include_once($path . ($fileName) . '.php');
				$service = $serviceArr[count($serviceArr) - 1];
				$response = array('class'=>$service);
				if(count($methodArr) > 0)
				{
					$method = $methodArr[0];
					$response['path'] = $fileName . '/' . $method;
					if(in_array($method, get_class_methods($service)))
					{
						$response['method'] = $method;
						array_shift($methodArr);
					}else if(in_array('_run', get_class_methods($service)))
					{
						$response['method'] = '_run';
					}
					$response['params'] = $methodArr;
					$response['cms'] = (bool)preg_match('/^\/?cms/', $fileName);
				}
				return $response;
			}
			array_unshift($methodArr, array_pop($serviceArr));
		}
		return null;
	}

}

?>