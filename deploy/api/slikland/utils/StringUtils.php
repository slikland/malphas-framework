<?php

namespace slikland\utils;
class StringUtils
{
	static public function blockTrim($content)
	{
		$content = preg_replace('/^\s*\n/m', '', $content);
		preg_match_all('/^\s*/m', $content, $tabs, PREG_SET_ORDER);
		$tabLen = PHP_INT_MAX;
		$tab = '';
		foreach($tabs as $t)
		{
			if(($l = strlen($t[0])) < $tabLen)
			{
				$tab = $t[0];
				$tabLen = $l;
			}
		}
		return preg_replace('/^'.$tab.'(.*?)$/m', '$1', $content);		
	}

	static public function slugify($value)
	{
		$value = trim($value);
		$value = static::removeAccents($value);
		$value = strtolower($value);
		$value = preg_replace('/\s+/', ' ', $value);
		$value = preg_replace('/\s/', '-', $value);
		return $value;
	}

	static public function removeAccents($text)
	{
		$isUTF8 = FALSE;
		if(mb_detect_encoding($text, 'UTF-8'))
		{
			$isUTF8 = TRUE;
			$text = utf8_decode($text);
		}
		$text = preg_replace_callback('/[^a-z\s\b]/', function ($values)
				{
					$value = utf8_encode($values[0]);
					$entity = htmlentities($value);
					$lower = html_entity_decode(strtolower($entity));
					$upper = html_entity_decode(strtoupper($entity));
					if($lower != $upper)
					{
						$value = preg_replace('/^\&(.).*$/', '$1', $entity);
					}
					return $value;
				}
			, $text);
		if($isUTF8)
		{
			$text = utf8_decode($text);
		}
		return $text;
	}

	static public function mbRemoveAccents($text)
	{
		$text = mb_ereg_replace_callback('[^a-z\s\b]', function ($values)
			{
				$value = $values[0];
				$entity = htmlentities($value);
				$lower = html_entity_decode(strtolower($entity));
				$upper = html_entity_decode(strtoupper($entity));

				if($lower != $upper)
				{
					$value = preg_replace('/^\&(.).*$/', '$1', $entity);
				}
				return $value;
			}
		, $text);
		return $text;
	}

	static public function mbSplitLetters($text)
	{
		return preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY);
	}

	static public function mbSplitWords($text)
	{
		return preg_split('/\s+/u', $text, -1, PREG_SPLIT_NO_EMPTY);
	}

	static public function mbLower($text)
	{
		return mb_strtolower($text);
	}

	static public function mbTrimWhiteSpace($text)
	{
		return preg_replace('/\s+/u', ' ', $text);
	}

	static public function mbTrim($text)
	{
		return static::mbLTrim(static::mbRTrim($text));
	}

	static public function mbLTrim($text)
	{
		return preg_replace('/^\s*/u', '', $text);
	}

	static public function mbRTrim($text)
	{
		return preg_replace('/\s*$/u', '', $text);
	}
}