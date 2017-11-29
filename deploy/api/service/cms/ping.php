<?php
namespace service\cms;

class ping
{
	function index()
	{
		$response = [];

		$userModule = get_module('cms/User');
		if(!$userModule->getCurrent())
		{
			$response[] = ['event'=>'check_user'];
		}


		return $response;
	}
}