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
		return 1;
	}

}
?>