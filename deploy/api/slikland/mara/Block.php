<?php
namespace slikland\mara;

if(!function_exists('isAssoc'))
{
	function isAssoc($arr)
	{
		if (array() === $arr) return false;
		return array_keys($arr) !== range(0, count($arr) - 1);
	}
}

class Block
{
	const _INSTRUCTION_RE = '/^([\(\#\@\>\<])?([^\:]*?)?(?:(?::)(.*?)(?:\#{([^\#\{\}\'\"]*?)})?)?\s*$/m';
	public static $TYPES = array(
		'1' => 'NORMAL',
		'2' => 'CONDITIONAL',
		'3' => 'REFERENCE',
		'4' => 'INSTANCE',
		'5' => 'FILE',
		'NORMAL' => 1,
		'CONDITIONAL' => 2,
		'REFERENCE' => 3,
		'INSTANCE' => 4,
		'FILE' => 5,
	);

	private static $_MARA_ID = 1;

	private $_maraId;
	private $_file;
	private $_type;
	private $_instance;
	private $_renderQueue = array();

	private $_condition;
	private $_reference;
	private $_attributes;
	private $_data;
	private $_classes;
	private $_tag;
	private $_children;
	private $_id;

	private $_currentReplaceObjectData;
	private $_replaceObject;

	function __construct($instruction, $file)
	{
		$this->_maraId = self::$_MARA_ID++;
		$this->_file = $file;

		preg_match(self::_INSTRUCTION_RE, $instruction, $instructionMatch);
		if($instructionMatch && $instructionMatch[1] == '#')
		{
			throw new \Exception('Comment line');
		}
		$this->_parseInstruction($instructionMatch);
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


	private function _get_maraId()
	{
		return $this->_maraId;
	}

	private function _get_file()
	{
		return $this->_file;
	}

	private function _get_name()
	{
		if(!$this->_instance)
		{
			return NULL;
		}
		return $this->_instance;
	}

	private function _get_tag()
	{
		if(!$this->_tag)
		{
			return NULL;
		}
		return $this->_tag;
	}

	private function _get_children()
	{
		return $this->_children;
	}

	private function _set_children($value)
	{
		if(!isset($value) || !is_array($value))
		{
			throw new \Exception('\slikland\mara\Block children needs to be an Array');
		}

		foreach($value as $v)
		{
			if(!($v instanceof \slikland\mara\Block))
			{
				throw new \Exception('\slikland\mara\Block children needs to be an Array of \slikland\mara\Block');
			}
		}
		$this->_children = $value;
	}

	private function _get_type()
	{
		return $this->_type;
	}

	public function toValue()
	{
		$obj = array();
		switch ($this->_type) {
			case 2:
				$obj['condition'] = $this->_condition;
				break;
			case 3:
				$obj['reference'] = $this->_reference;
				break;
			case 4:
				$obj['instance'] = $this->_instance;
				break;
			case 5:
				$obj['file'] = $this->_file;
				if(isset($this->_reference))
				{
					$obj['reference'] = $this->_reference;
				}
				break;
			default:
				$obj['tag'] = $this->_tag;
				break;
		}

		$obj['type'] = self::$TYPES[$this->_type];
		$obj['data'] = $this->_data;

		return $obj;
	}

	function _parseInstruction($instruction)
	{
		$ref = '';
		$this->_attributes = '';
		$this->_data = '';

		if(isset($instruction))
		{
			if(isset($instruction[2]))
			{
				$ref = $instruction[2];
			}
			if(isset($instruction[3]))
			{
				$this->_attributes = $instruction[3];
			}
			if(isset($instruction[4]))
			{
				$this->_data = $instruction[4];
			}
		}

		switch ($instruction[1])
		{
			case '(':
				$type = self::$TYPES['CONDITIONAL'];
				$ref = preg_replace('/\)\s*$/', '', $ref);
				$this->_condition = $ref;
				break;
			case '>':
				$type = self::$TYPES['REFERENCE'];
				$this->_reference = $ref;
				break;
			case '<':
				$type = self::$TYPES['INSTANCE'];
				$this->_instance = $ref;
				break;
			case '@':
				$type = self::$TYPES['FILE'];
				preg_match('/(.*?)(?:(?:\>)(.*?))?$/', $ref, $o);
				$this->_file = $o[1];
				if(isset($o[2]) && strlen($o[2]) > 0)
				{
					$this->_reference = $o[2];
				}
				break;
			default:
				$type = self::$TYPES['NORMAL'];
				$idClassRE = '/(#|.)([^\#\.]+)/';
				$id = NULL;
				$classes = array();

				preg_match_all($idClassRE, $ref, $matches, PREG_SET_ORDER);

				foreach($matches as $o)
				{
					switch($o[1])
					{
						case '#':
							$id = $o[2];
							break;
						case '.':
							$classes[] = $o[2];
							break;
						default:
							break;
					}
				}
				if(!is_null($id))
				{
					$this->_id = $id;
				}
				if(isset($classes) && !is_null($classes))
				{
					$this->_classes = $classes;
				}

				$ref = preg_replace('/[#.].*?$/', '', $ref);
				$this->_tag = $ref;
				break;
		}
		$this->_type = $type;
	}




	function _parseObjectString($object, $data = array(), $test = FALSE)
	{
		$replaceObject = preg_replace('/\#\{\}/', '$data', preg_replace('/\#\{([^\}\}\#]+)\}/', '$data[\'$1\']', $object));
		try
		{
			if(strlen($replaceObject) > 0)
			{
				$replacedObject = @eval('return '.$replaceObject.';');
				if($replacedObject)
				{
					$object = $replacedObject;
				}
			}
		}catch(\Exception $e)
		{
			if(DEBUG)
			{
				var_dump($e);
			}
		}

		if(!is_string($object))
		{
			$object = json_decode($object);
		}

		try
		{
			$object = $this->_replaceString($object, $data);
			$newObj = json_decode($object, TRUE);

			if($newObj)
			{
				$object = $newObj;
			}
		}catch(\Exception $e)
		{
			if(DEBUG)
			{
				var_dump($e);
			}
			if($object)
			{
				$object = array('html' => $object);
			}else
			{
				$object = array();
			}
		}

		if($test)
		{
			var_dump($object);
			return (Boolean)($object);
		}

		if(is_string($object))
		{
			$object = array('html'=>$object);
		}

		return $object;
	}

	function _replaceString($string, $data)
	{
		$this->_currentReplaceObjectData = $data;
		$string = preg_replace('/\$data\[\'(.*?)\'\]/', '\#\{$1\}', $string);
		$string = preg_replace('/\$data/', '\#\{\}', $string);
		$string = preg_replace_callback('/\#\{([^\}\}\#]+)?\}/', array($this, '_replaceObject'), $string);
		return $string;
	}

	function _replaceObject($match)
	{
		$name = NULL;
		if(isset($match[1]))
		{
			$name = $match[1];
		}
		$data = NULL;
		if($name)
		{
			if(isset($this->_currentReplaceObjectData) && isset($this->_currentReplaceObjectData[$name]))
			{
				$data = $this->_currentReplaceObjectData[$name];
			}
		}else
		{
			$data = $this->_currentReplaceObjectData;
		}
		if(!$data)
		{
			$data = '';
		}
		if(is_string($data))
		{
			$data = preg_replace('/\\\/', '\\\\\\\\', $data);
			$data = preg_replace('/"/', '\\"', $data);
			$data = preg_replace('/(\n|\r)/', '\\n', $data);
			$data = preg_replace('/\t/', '\\t', $data);
		}
		return $data;
	}

	function render($data, $context = NULL)
	{
		$tag = '';
		if(!$data && !$context)
		{
			$data = array('__'=>1);
		}
		if(is_null($context))
		{
			$context = new \slikland\mara\DOMContext('');
		}
		$ret = NULL;
		$fnName = '_render_' . self::$TYPES[$this->_type];
		if(method_exists($this, $fnName))
		{
			$ret = $this->$fnName($data, $context);
		}

		if($ret)
		{
			if(isset($ret[1]) && $ret[1] instanceof \slikland\mara\DOMContext)
			{
				$ret = array($ret);
			}
			foreach($ret as $d)
			{
				$data = $d[0];
				$context = $d[1];
				if(!empty($this->_children))
				{
					foreach($this->_children as $child)
					{
						$child->render($data, $context);
					}
				}
			}
		}
		return $context;
	}

	private function _render_NORMAL($data, $context = NULL)
	{
		if(!$this->_tag)
		{
			return array($data, $context);
		}

		$items = $data;

		if($this->_data && strlen($this->_data) > 0)
		{
			if(!empty($items) && isset($items[$this->_data]))
			{
				$items = $items[$this->_data];
			}else{
				$items = array();
			}
		}

		$ret = array();

		if(!empty($items))
		{
			if(!(is_array($items) && !isAssoc($items)))
			{
				$items = array($items);
			}
			foreach($items as $item)
			{
				$el = new \slikland\mara\DOMContext($this->_tag);
				$content = $this->_parseObjectString($this->_attributes, $item);
				$html = NULL;
				if($content)
				{
					if(isset($content['html']))
					{
						$html = $content['html'];
					}
					else if(isset($content['text']))
					{
						$html = $content['text'];
					}
					// else if(isset($content['content']))
					// {
					// 	$html = $content['content'];
					// 	unset($content['content']);
					// }

					unset($content['html']);
					unset($content['text']);

					if($html)
					{
						$el->innerHTML = $html;
					}

					foreach($content as $k=>$v)
					{
						if(is_string($k) || is_numeric($k))
						{
							$el->setAttribute($k, $v);
						}
					}
				}

				if($this->_id)
				{
					$el->setAttribute('id', $this->_id);
				}

				if(!empty($this->_classes))
				{
					$className = $el->className;
					$className = explode(' ', $className);
					$className = array_merge($className, $this->_classes);
					$el->className = implode(' ', $className);
				}
				$context->appendChild($el);
				$ret[] = array($item, $el);
			}
		}
		if(empty($ret))
		{
			$ret[] = array($data, $context);
		}
		return $ret;
	}

	function _renderLoadedBlock($block)
	{
		foreach($this->_renderQueue as $renderData)
		{
			$data = $renderData['data'];
			$context = $renderData['context'];
			$items = $data;
			if($this->_data && strlen($this->_data) > 0)
			{
				if(!empty($items) && isset($items[$this->_data]))
				{
					$items = $items[$this->_data];
				}
			}

			if($items)
			{
				if(!(is_array($items) && !isAssoc($items)))
				{
					$items = array($items);
				}
				foreach($items as $item)
				{
					$block->render($item, $context);
				}
			}
			$parentNode = $context->parentNode;
			$children = $context->childNodes;
			$prevChild = $context;
			$i = count($children);
			while($i-- > 0)
			{
				$child = $children[$i];
				$parentNode->insertBefore($child, $prevChild);
				$prevChild = $child;
			}
			$parentNode->removeChild($context);
		}
		$this->_renderQueue = array();
	}

	function _render_FILE($data, $context)
	{
		$div = new \slikland\mara\DOMContext('div');
		$div->style['display'] = 'none';
		$context->appendChild($div);
		$this->_renderQueue[] = array('data' => $data, 'context' => $div);
		$f = $this->_file;
		if($this->_reference)
		{
			$f .= '>' . $this->_reference;
		}
		try
		{
			$f = $this->_replaceString($f, $data);
			$template = \slikland\mara\Templates::getInstance();
			$template->get($f, array($this, '_renderLoadedBlock'));
		}catch(\Exception $e)
		{
			if(DEBUG)
			{
				var_dump($e);
			}
		}
		return array($data, $div);
	}
	function _render_INSTANCE($data, $context)
	{
		return array($data, $context);
	}
	
	function _render_REFERENCE($data, $context)
	{
		$div = new \slikland\mara\DOMContext('div');
		$div->style['display'] = 'none';
		$context->appendChild($div);
		$this->_renderQueue[] = array('data' => $data, 'context' => $div);
		$template = \slikland\mara\Templates::getInstance();
		$template->get($this->_file . '>' . $this->_reference, array($this, '_renderLoadedBlock'));
		return array($data, $div);
	}
	function _render_CONDITIONAL($data, $context)
	{
		if($this->_parseObjectString($this->_condition, $data, TRUE))
		{
			return array($data, $context);
		}
		else
		{
			return FALSE;
		}

	}

}





// 	_render_CONDITIONAL:(data, context)->
// 		if @_parseObjectString(@_condition, data, true)
// 			return [[data, context]]
// 		else
// 			return false
