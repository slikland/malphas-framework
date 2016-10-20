<?php
namespace slikland\mara;
class DOMContext
{
	public static $ID = 0;
	public $innerHTML = '';
	public $className = '';
	public $parentNode = NULL;
	public $childNodes = array();
	public $style = array();
	public $tagName;
	public $attributes = array();

	public $id;

	function __construct($tagName = 'div')
	{
		$this->id = self::$ID++;
		$this->tagName = $tagName;
	}

	function appendChild($child)
	{
		$this->childNodes[] = $child;
		$child->parentNode = $this;
	}

	function removeChild($child)
	{
		$i = count($this->childNodes);
		if($child->parentNode == $this)
		{
			$child->parentNode = NULL;
		}
		while($i-- > 0)
		{
			if($this->childNodes[$i] == $child)
			{
				array_splice($this->childNodes, $i, 1);
			}
		}

	}

	function insertBefore($child, $target)
	{
		$i = count($this->childNodes);
		$i = array_search($target, $this->childNodes);
		if($i === FALSE)
		{
			$this->childNodes[] = $child;
		}else
		{
			array_splice($this->childNodes, $i, 0, array($child));
		}
		$child->parentNode = $this;
	}

	function setAttribute($name, $value)
	{
		$this->attributes[$name] = $value;
	}

	function dump()
	{
		if(!empty($this->tagName))
		{
			print '<' . $this->tagName;

			if(!empty($this->style))
			{
				$style = array();
				foreach($this->style as $k=>$v)
				{
					$style[] = "$k:$v";
				}
				$this->attributes['style'] = implode(';', $style);
			}

			if(!empty($this->className))
			{
				$this->attributes['class'] = $this->className;
			}

			if(!empty($this->attributes))
			{
				$attrs = array();
				foreach($this->attributes as $k=>$v)
				{
					$attrs[] = $k . '="' . addslashes($v) . '"';
				}
				print ' ' . implode(' ', $attrs);
			}

			print '>';
		}

		if($this->innerHTML)
		{
			print $this->innerHTML;
		}

		foreach($this->childNodes as $child)
		{
			$child->dump();
		}

		if(!empty($this->tagName))
		{
			if(!in_array($this->tagName, array('br', 'hr', 'img', 'meta')))
			{
				print '</' . $this->tagName . '>';
			}
		}
	}

}
