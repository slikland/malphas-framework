<?php
namespace service;

class upload
{
	function __construct()
	{
		$this->module = get_module('net/Upload');
	}

	/**
	@permission
	@validate
		0:
			Data.required
		1:
			Data.required
	*/
	function index($data)
	{
		
		$this->module->saveChunk($data[0], $data[1], file_get_contents('php://input'));
	}

	/**
	@permission
	*/
	function start($data)
	{
		return $this->module->start($data);
	}

	/**
	@permission
	@validate
		0:
			Data.required
	*/
	function complete($data)
	{
		$uid = $data[0];
		$this->module->complete($uid);
		return $this->module->get($uid);
	}


	/**
		0:
			Data.required
	*/
	function remove($data)
	{
		// $data
	}
}