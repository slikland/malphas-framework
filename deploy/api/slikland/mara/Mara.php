<?php
namespace slikland\mara;
class Mara
{
	static $_rootPath = '';

	static function setRootPath($path)
	{
		self::$_rootPath = $path;
	}

	private $_children = array();
	private $_name = NULL;
	private $_id = NULL;
	private $_templates = NULL;
	private $_renderData = NULL;

	// constructor:(rootPath = null)->
	// 	@_templates = slikland.mara.Templates.getInstance(rootPath)

	// @get name:()->
	// 	return _name

	// @get id:()->
	// 	return _id

	// @get children:()->
	// 	return [].concat(_children)

	// render:(file, data, context = null)->
	// 	@_renderData = {
	// 		file: file
	// 		data: data
	// 		context: context
	// 	}
	// 	@_templates.get(file, @_templateLoaded)
	// reset:()->
	// 	@_renderData = null
	// _templateLoaded:(block)=>
	// 	if !@_renderData
	// 		return
	// 	block.render(@_renderData.data, @_renderData.context)

	// update:()->

	// find:()->

	// findAll:()->



	function __construct($rootPath = NULL)
	{
		$this->_templates = \slikland\mara\Templates::getInstance($rootPath);
	}

	function __get($property)
	{
		$fnName = '_get_' . $property;
		if(method_exists($this, $fnName))
		{
			return $this->$fnName();
		}
		throw new \Exception('Property ' . $property . ' does not exist.');
	}

	function __set($property, $value)
	{
		$fnName = '_set_' . $property;
		if(method_exists($this, $fnName))
		{
			return $this->$fnName($value);
		}
		throw new \Exception('Property ' . $property . ' does not exist.');
	}

	function _get_name()
	{
		return $this->_name;
	}

	function _get_id()
	{
		return $this->_id;
	}

	function _get_children()
	{
		return $this->_children;
	}

	function render($file, $data, $context = NULL)
	{
		$this->_renderData = array('file'=>$file, 'data'=>$data, 'context'=>$context);
		$this->_templates->get($file, array($this, '_templateLoaded'));
	}

	function reset()
	{
		$this->_renderData = NULL;
	}

	function _templateLoaded($block)
	{
		if(!$this->_renderData)
		{
			return;
		}
		$context = $block->render($this->_renderData['data'], $this->_renderData['context']);
		$context->dump();
	}

	function update()
	{

	}

	function find()
	{

	}

	function findAll()
	{

	}

}
