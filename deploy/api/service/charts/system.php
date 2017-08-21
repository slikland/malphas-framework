<?php
namespace service\charts;
class system
{
	function diskSpace()
	{
		$response = array();

		$server = get_module('core/Server');
		$response['type'] = 'doughnut';

		$total = $server->totalSpace();
		$free = $server->freeSpace();
		$data = array($total - $free, $free);

		$response['data'] = array(
			"labels"=> array(\slikland\utils\Scale::bytesToHuman($data[0]), \slikland\utils\Scale::bytesToHuman($data[1])),
			"datasets"=> array(array(
				"label"=> '',
				"data"=> $data,
				"backgroundColor"=>array('#FF6666', '#66FF66'),
			))
		);

		$response['options'] = array(
		);
		return $response;
	}

	function memoryUsage()
	{
		$response = array();

		$server = get_module('core/Server');
		$response['type'] = 'doughnut';

		$total = $server->memoryLimit();
		$used = $server->memory();
		$data = array($used, $total - $used);

		$response['data'] = array(
			"labels"=> array(\slikland\utils\Scale::bytesToHuman($data[0]), \slikland\utils\Scale::bytesToHuman($data[1])),
			"datasets"=> array(array(
				"label"=> '',
				"data"=> $data,
				"backgroundColor"=>array('#FF6666', '#66FF66'),
			))
		);

		$response['options'] = array(
		);
		return $response;
	}
}