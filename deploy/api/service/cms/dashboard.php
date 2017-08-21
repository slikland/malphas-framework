<?php
namespace service\cms;
class dashboard
{
	/**
	@cmsUser [0, 1, 2, 3]
	@user [0, 1, 2, 3]
	@method POST
	@log
	*/
	function usersPie($data)
	{
		// http://www.chartjs.org/docs/
		$response = array();
		$response['type'] = 'pie';
		$response['data'] = array(
			"labels"=> array("Red", "Blue", "Yellow", "Green", "Purple", "Orange"),
			"datasets"=> array(array(
			    "label"=> '# of Votes',
			    "data"=> array(12, 19, 3, 5, 2, 3),
			    "backgroundColor"=> array(
			        'rgba(255, 99, 132, 0.2)',
			        'rgba(54, 162, 235, 0.2)',
			        'rgba(255, 206, 86, 0.2)',
			        'rgba(75, 192, 192, 0.2)',
			        'rgba(153, 102, 255, 0.2)',
			        'rgba(255, 159, 64, 0.2)'
			    ),
			    "borderColor"=> array(
			        'rgba(255,99,132,1)',
			        'rgba(54, 162, 235, 1)',
			        'rgba(255, 206, 86, 1)',
			        'rgba(75, 192, 192, 1)',
			        'rgba(153, 102, 255, 1)',
			        'rgba(255, 159, 64, 1)'
			    ),
			    "borderWidth"=> 1
			))
		);
		$response['options'] = array();
		return $response;
	}

	/**
	@permission
	*/
	function usersBar($data)
	{
		// http://www.chartjs.org/docs/
		$response = array();
		$response['type'] = 'bar';
		$response['data'] = array(
			"labels"=> array("Red", "Blue", "Yellow", "Green", "Purple", "Orange"),
			"datasets"=> array(array(
			    "label"=> '# of Votes',
			    "data"=> array(12, 19, 3, 5, 2, 3),
			    "backgroundColor"=> array(
			        'rgba(255, 99, 132, 0.2)',
			        'rgba(54, 162, 235, 0.2)',
			        'rgba(255, 206, 86, 0.2)',
			        'rgba(75, 192, 192, 0.2)',
			        'rgba(153, 102, 255, 0.2)',
			        'rgba(255, 159, 64, 0.2)'
			    ),
			    "borderColor"=> array(
			        'rgba(255,99,132,1)',
			        'rgba(54, 162, 235, 1)',
			        'rgba(255, 206, 86, 1)',
			        'rgba(75, 192, 192, 1)',
			        'rgba(153, 102, 255, 1)',
			        'rgba(255, 159, 64, 1)'
			    ),
			    "borderWidth"=> 1
			))
		);
		$response['options'] = array();
		return $response;
	}
}