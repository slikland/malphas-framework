<?php
namespace slikland\service;

class setup{
	/**
	@output
		html
	*/
	function index()
	{
		print 123;
	}

	/**
	@output text
	*/
	function test()
	{
		$users = new \slikland\db\DBHelper('cms_user');
		var_dump($users->get());
		return $users;
	}

	/**
	@output json
	@afilename 2test.yaml
	*/
	function exportDB()
	{
		global $config;
		if(!File::isWritable(API_PATH . 'schema/'))
		{
			throw new Error('Please change permission of ' . API_PATH . 'schema/');
		}
		$schema = new \slikland\db\SchemaParser();
		$data = $schema->parseTables();
		include_once('vendors/Spyc.php');
		// outputFileName('SomeName.yaml');
		// spyc_dump($data);
		foreach($data as $k=>$v)
		{
			$sql = $schema->generateCreateSchema($k, $v);
			// print($sql);
			// print "\n\n\n\n";
		}
		$schema->exportTables($data);
		// return var_export($data);
		// return $data;
		// return spyc_dump($data);
	}

	function syncDB()
	{

	}
}

// get(array('a','b','c'));
// get(array('a','b','c'), array('pk_user'=>1));
// get(array('pk_user'=>1));
// get(array('pk_user'=>1));
// get(
// 	array(
// 		"fields"=>array(),
// 		"where"=>array(),
// 		"order"=>array('name','asd','asd'),
// 		"limit"=>array(1,10),
// 		)
// );
