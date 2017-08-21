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
}