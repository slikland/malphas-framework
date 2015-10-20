<?php
namespace model\cms;
class index extends Model{
	function view()
	{
		$userController = controller\cms\User::getInstance();
		if($user = $userController->getSession())
		{
			$interface = new \controller\cms\Core();
			$menuData = $interface->getInterface();

			$interfaceData = array();
			$interfaceData['menu'] = $menuData;
			$interfaceData['user'] = $user;

			return array('__user'=>$user, '__interface' => slikland\template\TemplateLoader::load('cms/index'), 'data'=>$interfaceData);
		}else{
			return array('__user'=>false, '__interface' => slikland\template\TemplateLoader::load('cms/login'));
		}
	}

	function index()
	{
		return 1;
	}

}
?>