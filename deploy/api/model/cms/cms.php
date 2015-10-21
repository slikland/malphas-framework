<?php
namespace model\cms;

/**
*	@addToMenu("CMS", 9998, [1])
*/
class cms extends Model{
	/**
	*	@addToMenu("Settings")
	*/
	function settings($data){
		$response = array();
		$response['values'] = $this->controller->getSettings();
		return $response;
	}
	function updateSettings($data)
	{
		$this->controller->setSettings($data);
		return True;
	}
}
?>