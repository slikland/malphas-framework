<?php
namespace slikland\service\core;

class stats{
	/**
	// @output
	// 	html
	*/
	function index()
	{
		$response = array();
		$response['memory'] = $this->memory();
		$response['phpVersion'] = $this->phpVersion();
		$response['extensions'] = $this->extensions();
		$response['disk'] = $this->disk();
		$response['apache'] = array();
		// $response['apache']['modules'] = $this->apacheModules();

		return $response;
	}

	function memory()
	{
		$response = array(
			'memory_usage' => memory_get_usage(FALSE),
			'real_memory_usage' => memory_get_usage(TRUE),
			'peak_memory_usage' => memory_get_usage(FALSE),
			'real_peak_memory_usage' => memory_get_usage(TRUE),
		);
		return $response;
	}

	function phpVersion()
	{
		return phpversion();
	}

	function extensions()
	{
		return get_loaded_extensions();
	}

	function apacheModules()
	{
		// return @apache_get_modules();
	}

	function disk()
	{
		$root = preg_replace('/^(\/|.\:).*?$/', '$1', realpath(__DIR__));
		var_dump($root);
		$total = disk_total_space($root);
		$free = disk_free_space($root);
		$response = array(
			'usage'=>($total - $free),
			'free'=>$free,
			'total'=>$total,
		);
		return $response;
	}

}