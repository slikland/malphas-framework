<?php
namespace slikland\service\cms;
class user
{
	function __construct()
	{
		$this->module = get_module('cms/User');
	}

	/**
	// @method POST
	*/
	function login($data)
	{
		return $this->module->login($data['email'], $data['pass']);
		// return $this->module->getList();
	}

	function getUser($data)
	{
		return $this->module->getCurrent();
	}
}
