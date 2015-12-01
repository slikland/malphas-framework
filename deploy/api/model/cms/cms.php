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
		return array('refresh'=>True);
	}

	/**
	*	@addToMenu("CKEditor")
	*/
	function ckEditor($data)
	{
		$response = array();
		// $response['']

		$response['_ckeditor'] = array(
			'toolbarGroups' => array(
				array(
					'name' => 'clipboard',
					'groups' => array('clipboard', 'undo'),
				),
				array(
					'name' => 'editing',
					'groups' => array('find', 'selection', 'spellchecker'),
				),
				array(
					'name' => 'clipboard',
					'groups' => array('clipboard', 'undo'),
				),
				array(
					'name' => 'tools',
					'groups' => array('clipboard', 'undo'),
				),
				array(
					'name' => 'others',
				),
				array(
					'name' => 'basicstyles',
					'groups' => array('basicstyles', 'cleanup'),
				),
			)
		);
		$response['ckEditorValue'] = Settings::get('ckEditorValue');

	// config.toolbarGroups = [
	// 	{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
	// 	{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
	// 	{ name: 'links' },
	// 	{ name: 'insert' },
	// 	{ name: 'forms' },
	// 	{ name: 'tools' },
	// 	{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
	// 	{ name: 'others' },
	// 	'/',
	// 	{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
	// 	{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
	// 	{ name: 'styles' },
	// 	{ name: 'colors' },
	// 	{ name: 'about' }
	// ];

	// // Remove some buttons provided by the standard plugins, which are
	// // not needed in the Standard(s) toolbar.
	// config.removeButtons = 'Underline,Subscript,Superscript';

	// // Set the most common block elements.
	// config.format_tags = 'p;h1;h2;h3;pre';

	// // Simplify the dialog windows.
	// config.removeDialogTabs = 'image:advanced;link:advanced';

		return $response;
	}

	function updateCKEditor($data)
	{
		Settings::set('ckEditorValue', $data['ckEditorValue']);
		return array('refresh'=>'true');

	}
}
?>