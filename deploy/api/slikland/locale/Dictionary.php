<?php
namespace slikland\locale;

class Dictionary
{
	static function listLanguages()
	{
		$locales = \slikland\fs\File::listDir(API_PATH . 'locale/', 'yaml$');
		$languages = array();
		foreach($locales as $locale)
		{
			$locale = trim(str_replace(API_PATH . 'locale/', '', $locale), '/');
			$locale = preg_replace('/\.yaml$/i', '', $locale);
			$languages[] = $locale;
		}
		return $languages;
	}

	static function translate()
	{
		
	}

	static function parseScripts()
	{

	}
}