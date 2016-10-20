<?php
namespace slikland\mara;
class Templates
{
	private static $instance = NULL;
	final public static function getInstance($rootPath = NULL)
	{
		if(!self::$instance)
		{
			$c = static::class;
			self::$instance = new $c($rootPath);
		}
		return self::$instance;
	}

	protected $_templates = array();
	protected $_rootPath = '';
	protected $_callbacks = array();

	function __construct($rootPath = NULL)
	{
		if($rootPath)
		{
			$this->rootPath = $rootPath;
		}
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

	private function _get_rootPath()
	{
		return $this->_rootPath;
	}

	private function _set_rootPath($value)
	{

		if(!is_string($value))
		{
			return;
		}

		$value = rtrim(trim($value), '/');
		if(strlen($value) > 0)
		{
			$value .= '/';
		}

		$this->_rootPath = $value;
	}


	private function _addInstance($block)
	{
		$this->_templates[] = $block;
	}

	private function _findInstance($file, $name = NULL)
	{
		preg_match('/(.*?)(?:(?:\>)(.*?))?$/', $file, $o);
		$file = $o[1];
		if(!$name && isset($o[2]) && !empty($o[2]))
		{
			$name = $o[2];
		}
		$i = count($this->_templates);
		while($i-- > 0)
		{
			$block = $this->_templates[$i];
			if($block->file == $file && $block->name == $name)
			{
				return $block;
			}
		}

		return NULL;

	}

	function get($file, $callback = NULL)
	{
		$block = $this->_findInstance($file);
		if($block)
		{
			if($callback)
			{
				if(is_array($callback))
				{
					call_user_func(array($callback[0], $callback[1]), $block);
				}else{
					$callback($block);
				}
			}
		}else{
			$this->_callbacks[] = array('file'=>$file, 'callback'=>$callback);
			$this->load($file);
		}
	}

	function load($file)
	{
		preg_match('/(.*?)(?:(?:\>)(.*?))?$/', $file, $o);
		$file = $o[1];
		$file = trim($file);
		if(strlen($file) < 2)
		{
			return;
		}
		if(!preg_match('/\.mara$/i', $file))
		{
			$file .= '.mara';
		}
		if(substr($file, 0, 1) == '/')
		{
			$path = $file;
		}else
		{
			$path = $this->_rootPath . $file;
		}

		$data = @file_get_contents($path);
		$this->_fileLoaded($data, $file);
	}

	function _checkCallbacks()
	{
		$i = count($this->_callbacks);
		foreach($this->_callbacks as $k=>$item)
		{
			$file = $item['file'];
			$callback = $item['callback'];
			$block = $this->_findInstance($file);
			if($block)
			{
				unset($this->_callbacks[$k]);
				if(is_array($callback))
				{
					call_user_func(array($callback[0], $callback[1]), $block);
				}else{
					$callback($block);
				}
			}
		}
	}

	function _fileLoaded($data, $file)
	{
		$this->_parse($data, $file);
		$this->_checkCallbacks();
	}

	function _parse($data, $file = '')
	{
		$file = preg_replace('/\.mara$/', '', $file);
		$blocks = $this->_parseBlocks($data . "\n", $file);
		try{
			if(count($blocks) > 1)
			{
				$block = new \slikland\mara\Block('', $file);
				$block->children = $blocks;
			}else if(count($blocks) == 1)
			{
				$block = $blocks[0];
			}else{
				return;
			}
			$this->_addInstance($block);
		}catch(\Exception $e)
		{
		}
	}

	function _removeIndent($data)
	{
		$indentLength = PHP_INT_MAX;
		$indent = NULL;
		$indentRE = '/^(\s*)[^\s].*?$/m';
		preg_match_all($indentRE, $data, $matches, PREG_SET_ORDER);
		foreach($matches as $o)
		{
			$i = $o[1];
			if(count($i) < $indentLength)
			{
				$indentLength = count($i);
				$indent = $i;
			}
		}

		if($indent)
		{
			$data = preg_replace('/^'.$indent.'/m', '', $data);
		}

		return $data;
	}

	function _parseBlocks($data, $file = '')
	{
		$data = $this->_removeIndent(preg_replace('/^\s*\n/m', '', $data));
		$blockRE = '/(\s*)([^\s].*?\n)((?:^\1[ |\t]+[^\n]*?(?:\n|$))*)/m';
		$blocks = array();
		preg_match_all($blockRE, $data, $matches, PREG_SET_ORDER);
		$blockTypes = \slikland\mara\Block::$TYPES;
		$c = 0;
		foreach($matches as $o)
		{
			try{
				$block = new \slikland\mara\Block($o[2], $file);
			}catch(\Exception $e)
			{
				continue;
			}

			if($block->type == $blockTypes['INSTANCE'])
			{
				$this->_addInstance($block);
			}else{
				$blocks[] = $block;
			}

			$content = $o[3];
			if(strlen($content) > 0)
			{
				$children = $this->_parseBlocks($content, $file);
				$block->children = $children;
			}
		}
		return $blocks;
	}
}