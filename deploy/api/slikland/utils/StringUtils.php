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

	static public function html_encode($value)
	{
		$value = mb_ereg_replace_callback('([\W]|[^a-z\s\b])', [__CLASS__, '_replaceHTMLSymbols'], $value);
		return $value;
	}

	static private function _replaceHTMLSymbols($v)
	{
		$value = htmlentities($v[0]);
		if($value == $v[0])
		{
			$value = '&#' . ord($v[0]) . ';';;
		}

		return $value;
	}

	static public function normalize($value)
	{
		$value = trim($value);
		$value = static::removeAccents($value);
		$value = strtolower($value);
		$value = preg_replace('/\s+/', ' ', $value);
		return $value;
	}

	static public function slugify($value)
	{
		$value = static::normalize($value);
		$value = preg_replace('/\s/', '-', $value);
		$value = preg_replace('/\./', '', $value);
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

	static public function escapeUnicode($value)
	{
		$value = preg_replace_callback('/[^\x20-\x7e\xa0-\xff]/u', function($values){
			$v = $values[0];
			try{
				$v = dechex(unpack('N', mb_convert_encoding($v, 'UCS-4BE', 'UTF-8'))[1]);
				$v = str_pad($v, 4, '0', STR_PAD_LEFT);
			}catch(\Exception $e)
			{

			}

			if(empty($v)) $v = $values[0];
			return '&#x' . $v . ';';
		}, $value);
		return $value;
	}


}