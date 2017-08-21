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
				$message = "Esse campo deve ter entre {$min} a {$max} caracteres.";
			}else if(!is_null($min))
			{
				$message = "Esse campo deve ser maior que {$min} caracteres.";
			}else
			{
				$message = "Esse campo não deve ser maior que {$max} caracteres.";
			}

			return array('message'=>$message, 'data'=>array('min'=>$min, 'max'=>$max));
		}
		return TRUE;
	}

	/**
	@message
		Email inválido
	*/
	public static function email($value, $params = NULL)
	{
		if(!isset($value) || empty($value))
		{
			return TRUE;
		}
		$regex = '/^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,3})$/'; 
		if(preg_match($regex, $value))
		{
			return TRUE;
		}
		return FALSE;
	}

	public static function cpf($value, $data)
	{
		$cpf = preg_replace('/\D/', '', $value);
		$result = TRUE;

		if(strlen($cpf) < 11)
		{
			return FALSE;
		}

		if(preg_match('/^((\d)\2+)$/', $value))
		{
			return FALSE;
		}

		$check = '';

		$sum = 0;
		$numbers = str_split(substr($cpf, 0, 9));
		foreach($numbers as $i=>$number)
		{
			$sum += $number * (10 - $i);
		}
		if(($sum % 11) < 2)
		{
			$check = 0;
		}else
		{
			$check = 11 - ($sum % 11);
		}

		$sum = 0;
		$numbers = str_split(substr($cpf, 0, 10));
		foreach($numbers as $i=>$number)
		{
			$sum += $number * (11 - $i);
		}

		if(($sum % 11) < 2)
		{
			$check .= 0;
		}else
		{
			$check .= 11 - ($sum % 11);
		}
		return ($check == substr($cpf, 9, 2));
	}

	public static function phone($value, $params)
	{
		if(!isset($value) || empty($value))
		{
			$value = '';
		}
		$value = preg_replace('/\D/', '', $value);
		if(preg_match('/^(\d{2})?(\d{2})?9?\d{8}$/', $value))
		{
			return TRUE;
		}
		return FALSE;
	}


}
