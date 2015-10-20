<?php
namespace model\cms;
class index extends Model{
	function view()
	{
		$userController = controller\cms\User::getInstance();
		if($userController->isLogged())
		{
			$interface = new \controller\cms\Core();
			$menuData = $interface->getInterface();

			$interfaceData = array();
			$interfaceData['menu'] = $menuData;

			return array('__view' => slikland\template\TemplateLoader::load('cms/index'), 'data'=>$interfaceData);
		}else{
			return array('__view' => slikland\template\TemplateLoader::load('cms/login'));
		}
	}

	function index()
	{
		return 1;
	}

}
?>