<?php
namespace validation;
class String{
	/**
	@message
		*{validation_string_length}
	*/
	public static function length($value, $data)
	{
		$l = (int)@strlen($value);
		$min = NULL;
		$max = NULL;
		if(is_int($data))
		{
			$max = (int) $data;
		}else if(is_array($data))
		{

			if(isset($data['min']))
			{
				$min = (int)$data['min'];
			}
			if(isset($data['max']))
			{
				$max = (int)$data['max'];
			}

		}

		$valid = TRUE;
		if(!is_null($min) && $l < $min)
		{
			$valid = FALSE;
		}
		if(!is_null($max) && $l > $max)
		{
			$valid = FALSE;
		}

		if(!$valid)
		{
			if(!is_null($min) && !is_null($max))
			{
				$message = "*{validation_string_length}";
			}else if(!is_null($min))
			{
				$message = "*{validation_string_min_length}";
			}else
			{
				$message = "*{validation_string_max_length}";
			}

			return array('message'=>$message, 'data'=>array('min'=>$min, 'max'=>$max));
		}
		return TRUE;
	}
}
