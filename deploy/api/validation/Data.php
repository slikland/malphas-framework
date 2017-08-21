<?php
namespace validation;

class Data
{

	/**
	@message
		Campo obrigatório
	*/
	public static function required($value)
	{
		return isset($value) && (is_numeric($value) || !empty($value));
	}

}
