<?php
namespace service;
class test
{
	/**
	@cmsUser [0, 1, 2, 3]
	@user [0, 1, 2, 3]
	@method GET
	@validate
		name:
			Data.required
			String.length: {min: 3, max: 50}
	*/
	function test($data)
	{
		return array('message'=>'*{hello_world}', 'name'=>$data['name']);
	}

	function test2($data)
	{
		$cmsUser = getModule('cms/User');
		return getModule('cms/User');

	}

	function test3()
	{
		$db = db();
		$a = $db->fetch_all('SHOW TABLES');
		$a = $db->fetch_all('DESCRIBE cms_user');

		$schema = new \slikland\db\SchemaParser();
		$schema->parseFolder(API_PATH . 'schema');


		var_dump($schema);
		// return $files;
	}
}