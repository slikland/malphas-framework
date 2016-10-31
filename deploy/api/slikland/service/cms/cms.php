<?php
namespace slikland\service\cms;
class cms
{
	function __construct()
	{
		$this->module = get_module('cms/CMS');
	}
	/**
	@method POST
	@permission 
	*/
	function getInterface()
	{
		$response = array();
		$response['pages'] = $this->module->getPages();
		$response['menu'] = array('items'=>$this->module->getMenu());
		$response['config'] = array('items'=>$this->module->getMenu('config'));
		return $response;
	}

	/**
	@method POST
	@permission [1]
	*/
	function getPages()
	{
		$response = array();
		$pages = $this->module->getPages(TRUE);
		$response['pages'] = $pages;
		$response['menu'] = $this->module->getMenu();
		$response['config'] = $this->module->getMenu('config');
		return $response;
	}

	/**
	@method POST
	@permission [1]
	*/
	function updateMenu($data)
	{
		$this->module->updatePages($data['data']['pages'][0], 'pages');
		$this->module->updatePages($data['data']['menu'][0], 'menu');
		$this->module->updatePages($data['data']['config'][0], 'config');
		return TRUE;
	}

}
