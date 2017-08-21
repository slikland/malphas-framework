<?php
namespace validation;

class MimeType
{

	/**
	@message
		*{validation_required}
	*/
	public static function match($value, $data)
	{
		$mimeType = '--';
		if(preg_match('/^(http\s?\:)?\/\//', $value))
		{
			$requestModule = get_module('net/Request');
			$mimeType = $requestModule->getMimeType($value);
		}else if(isset($value['type']))
		{
			$mimeType = $value['type'];
		}
		return (bool)preg_match($data[0], $mimeType);
	}

}
