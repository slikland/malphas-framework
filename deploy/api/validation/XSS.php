<?php
namespace validation;

class XSS
{
	public static function test($value)
	{
		if(is_array($value))
		{
			foreach($value as $val)
			{
				if(!self::test($val))
				{
					return FALSE;
				}
			}
		}else
		{
			if(preg_match('/((\%3C)|<)[^\n]+((\%3E)|>)/i', (string)$value))
			{
				return FALSE;
			}
		}
		return TRUE;
	}

}
