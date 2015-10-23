<?php
namespace slikland\template;
class TemplateLoader{
	public static function load($path)
	{
		$templatePath = API_PATH . 'view/' . preg_replace('/\./', '/', $path) . '.tpl';
		if(!file_exists($templatePath))
		{
			$templatePath = API_PATH . 'view/' . preg_replace('/\./', '/', $path) . '/index.tpl';
		}
		$template = NULL;
		if(file_exists($templatePath))
		{
			$template = file_get_contents($templatePath);
			$template = self::parseTemplate($template);
		}
		return $template;
	}

	private static function parseTemplate($template)
	{
		preg_match_all('/^((\s*)\<([^\s\:]+)(.*?))$/m',$template, $matches, PREG_SET_ORDER);
		foreach($matches as $match){
			if(strstr($template, '!' . $match[3]) !== FALSE){
				continue;
			}
			$temp = TemplateLoader::load($match[3]);
			$temp = preg_replace('/^(.*?)(\\n|$)/', '$1' . $match[4] . "\n", $temp);

			if(!is_null($temp))
			{
				$temp = preg_replace('/^(.*?)$/m', $match[2] . '$1', $temp);
				$name = preg_replace('/(\.|\\/)/m', '\\\\$1', $match[3]);
				$template = preg_replace('/^'.$match[1].'/m', $temp, $template);
			}
		}
		return $template;
	}
}
?>