<?php
namespace controller\cms;
class Cms extends Controller
{
	private $settings = array(
		array('label'=>'Title', 'name'=>'cms_title')
	);
	function getSettings()
	{
		$values = array();
		foreach($this->settings as $setting)
		{
			$values[] = array('label'=>$setting['label'], 'name'=>$setting['name'], 'value'=>Settings::get($setting['name']));
		}
		return $values;
	}

	function setSettings($values)
	{
		foreach($this->settings as $setting)
		{
			if(isset($values[$setting['name']]))
			{
				Settings::set($setting['name'], $values[$setting['name']]);
			}
		}

	}
}
?>