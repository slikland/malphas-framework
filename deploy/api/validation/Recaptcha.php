<?php
namespace validation;
class Recaptcha{
	public static function validate($value, $data)
	{
		$recaptchaModule = get_module('social/Recaptcha');
		return $recaptchaModule->validate($value, $data);
	}
}
