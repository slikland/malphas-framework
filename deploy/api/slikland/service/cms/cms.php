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
		$pages = $this->module->getPages(TRUE, TRUE);
		$response['pages'] = $pages;
		$response['menu'] = $this->module->getMenu(NULL, 0, TRUE);
		$response['config'] = $this->module->getMenu('config', 0, TRUE);
		return $response;
	}

	/**
	@method POST
	@permission [1]
	*/
	function updateMenu($data)
	{
		$this->module->updatePages($data['pages'][0], 'pages');
		$this->module->updatePages($data['menu'][0], 'menu');
		$this->module->updatePages($data['config'][0], 'config');
		return TRUE;
	}

	/**
	@permission [1]
	*/
	function getColors()
	{
		$colorModule = get_module('cms/Colors');
		return $colorModule->getColors();
	}

	/**
	@method POST
	@permission [1]
	@validation
		primary_color:
			Data.required
		secondary_color:
			Data.required
	*/
	function setColors($data)
	{
		$colorModule = get_module('cms/Colors');
		$colors = array();
		$colors['primary'] = $data['primary_color'];
		$colors['secondary'] = $data['secondary_color'];
		return $colorModule->setColors($colors);
	}

}
