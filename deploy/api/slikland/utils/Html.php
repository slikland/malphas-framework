<?php
class Html
{
	// Html('TAG', 'Content')
	// Html($parent, 'TAG', 'Content')
	function __construct()
	{
		$args = func_get_args();
		if(isset($args[0]) && $args[0] instanceof Html)
		{
			$args[0]->addChild($this);
			array_shift($args);
		}
		$this->tag = (isset($args[0]))?$args[0]:'div';
		$this->content = (isset($args[1]) && is_string($args[1]))?$args[1]:'';
		$this->_numChildren = 0;
		$this->attributes = (isset($args[2]) && is_array($args[2]))?$args[2]:array();
		$this->children = array();
	}

	function attr($name, $value)
	{
		$this->attributes[$name] = $value;
	}

	function content($value)
	{
		$this->content = $value;
	}

	function tag($value)
	{
		$this->tag = $value;
	}

	function addChild($child)
	{
		$this->children[] = $child;
		$this->_numChildren++;		
	}

	function render($return = FALSE)
	{
		$children = $this->_renderChildren();
		if(empty($this->tag))
		{
			$out = $children;
		}else{
			$out = '<' . $this->tag;
			if(count($this->attributes) > 0)
			{
				foreach($this->attributes as $k=>$v)
				{
					$out .= ' ' . $k . '="' . str_replace("\/", "/", $v) . '"';
				}
			}
			if($this->tag != 'iframe' && empty($this->content) && $this->_numChildren == 0)
			{
				$out .= '/>';
			}else{
				$out .= '>';
				$out .= $this->content;
				$out .= $children;
				$out .= '</' . $this->tag . '>';
			}
		}
		if($return)
		{
			return $out;
		}else
		{
			print $out;
		}
	}

	private function _renderChildren()
	{
		$out = '';
		foreach($this->children as $child)
		{
			try{
				$out .= $child->render(TRUE);
			}catch(\Exception $e)
			{

			}
		}
		return $out;
	}
}