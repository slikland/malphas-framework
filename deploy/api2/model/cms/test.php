<?php
namespace model\cms;
/**
*	@addToMenu("Test", 9999, [1, 2])
*/
class test extends Model
{

	/**
	*	@addToMenu("Test")
	*/
	function test()
	{
		$response = array();

		return $response;
	}

	/**
	*	@addToMenu("Range")
	*/
	function range()
	{
		$response = array();
		$response['bla'] = '123';
		$response['items'] = array(
			array('value'=>1),
			array('value'=>2),
		);

		return $response;
	}

	function updateTest($data)
	{
		$response = array();
		return $response;
	}
}
?>