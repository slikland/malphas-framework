<?php
namespace validation;

class Data
{

	/**
	@message
		*{validation_required}
	*/
	public static function required($value)
	{
		return isset($value);
	}

}
