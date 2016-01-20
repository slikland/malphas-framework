<?php
namespace model\cms;
class index extends Model{
	function view()
	{
		$userController = controller\cms\User::getInstance();
		$response = array();
		if($user = $userController->getSession())
		{
			$interface = new \controller\cms\Core();
			$menuData = $interface->getInterface();

			$interfaceData = array();
			$interfaceData['menu'] = $menuData;
			$interfaceData['user'] = $user;
			$interfaceData['title'] = Settings::get('cms_title');
			$response = array_merge($response, $interfaceData);
			$response['__user'] = $user;
			$response['__interface'] = slikland\template\TemplateLoader::load('cms/interface');
		}else{
			$response['__user'] = FALSE;
			$response['__interface'] = slikland\template\TemplateLoader::load('cms/login');
		}
		return $response;
	}

	function index()
	{
		$response = array();

		$response['title'] = Settings::get('cms_title');
		$response['chart1'] = array(
			'header'=>array(
				array('name'=>'labels'),
				array('name'=>'values'),
				array(
					'name'=>'data',
					'values'=>array(
						array('name'=>'time'),
						array('name'=>'value'),
						array('name'=>'value2'),
						array('name'=>'value3'),
					)),
			),
			'data'=>array(
				array("Time", "Value"),
				array('value', 'value2', 'value3'),
				array(
					array(111, 222, 100, 100),
					array(333, 444, 100, 100),
					array(111, 222, 100, 100),
					array(333, 444, 100, 100),
					array(111, 222, 100, 100),
					array(333, 444, 100, 100),
					array(111, 222, 100, 100),
					array(333, 444, 100, 100),
					array(111, 222, 100, 100),
					array(333, 444, 100, 100),
					array(111, 222, 100, 100),
					array(333, 444, 100, 100),
					array(111, 222, 100, 100),
					array(333, 444, 100, 100),
					array(111, 222, 100, 100),
					array(333, 444, 100, 100),
				)
			),
		);

		$response['grids'] = array(
			array(
				array('id'=>'1', 'x'=>0,'y'=>0,'w'=>2,'h'=>2,'thumb'=>'http://lorempixel.com/400/200/?1'),
				array('id'=>'1', 'x'=>2,'y'=>1,'w'=>1,'h'=>1,'thumb'=>'http://lorempixel.com/400/200/?2'),
			)
		);

		return $response;
	}

}
?>