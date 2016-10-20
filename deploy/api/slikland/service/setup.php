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
	function test()
	{
		print 1234;
	}

	/**
	@output adownload
	@afilename 2test.yaml
	*/
	function exportDB()
	{
		global $config;

		$schema = new \slikland\db\SchemaParser();
		$data = $schema->parseTables();
		include_once('vendors/Spyc.php');
		// outputFileName('SomeName.yaml');
		spyc_dump($data);
		foreach($data as $k=>$v)
		{
			$sql = $schema->generateCreateSchema($k, $v);
			print($sql);
			print "\n\n\n\n";
		}

		return spyc_dump($data);
	}

	function syncDB()
	{

	}
}