<?php
namespace slikland\module\cms;

class Colors
{
	static $textColors = array(
		'light'=>'#FFFFFF',
		'dark'=>'#424242'
	);
	static $defaultColors = array(
		'primary'=>'#607d8b',
		'secondary'=>'#2196f3'
	);

	private static function lighten($color, $amount)
	{
		$r = $color['r'];
		$g = $color['g'];
		$b = $color['b'];
		$max = 0xFF;
		if($amount < 0)
		{
			$max = 0;
			$amount *= -1;
		}
		$r += ($max - $r) * $amount;
		if($r < 0)
		{
			$r = 0;
		}else if($r > 0xFF)
		{
			$r = 0xFF;
		}

		$g += ($max - $g) * $amount;
		if($g < 0)
		{
			$g = 0;
		}else if($g > 0xFF)
		{
			$g = 0xFF;
		}

		$b += ($max - $b) * $amount;
		if($b < 0)
		{
			$b = 0;
		}else if($b > 0xFF)
		{
			$b = 0xFF;
		}

		$b >>= 0;

		return self::parseColor($r << 16 | $g << 8 | $b);
	}

	private static function luminance($color)
	{
		return ($color['r'] * 0.2126 + $color['g'] * 0.7152 + $color['b'] * 0.0722) / 0xFF;
	}

	private static function parseColor($color)
	{
		$r = 0;
		$g = 0;
		$b = 0;
		if(is_int($color))
		{
			$r = $color >> 16 & 0xFF;
			$g = $color >> 8 & 0xFF;
			$b = $color & 0xFF;
		}else if(is_string($color))
		{
			$color = preg_replace('/^\#/', '', $color);
			if(strlen($color) == 3)
			{
				$color = hexdec($color);
				$r = ($color >> 8 & 0xF) * (1 / 0xF);
				$g = ($color >> 4 & 0xF) * (1 / 0xF);
				$b = ($color & 0xF) * (1 / 0xF);
			}elseif(strlen($color) == 6)
			{
				$color = hexdec($color);
				$r = $color >> 16 & 0xFF;
				$g = $color >> 8 & 0xFF;
				$b = $color & 0xFF;
			}
		}
		$hex = dechex($color);
		while(strlen($hex) < 6) $hex = '0' . $hex;

		return array('hex'=>$hex, 'r'=>$r, 'g'=>$g, 'b'=>$b);
	}

	function __construct()
	{
		$this->colors = $this->getColors();

	}

	private function getColors()
	{
		$cmsColors = Setting::getAll('_color_%');
		$colors = self::$defaultColors;
		foreach($cmsColors as $color)
		{
			$name = preg_replace('/^_color_/', '', $color['name']);
			$colors[$name] = $color['value'];
		}
		$fullColors = array();
		foreach($colors as $k=>$color)
		{
			$color = self::parseColor($color);
			$light = self::lighten($color, 0.2);
			$dark = self::lighten($color, -0.2);

			$textColor = (self::luminance($color) > 0.75)?self::parseColor(self::$textColors['dark']):self::parseColor(self::$textColors['light']);
			$textColorLight = (self::luminance($light) > 0.75)?self::parseColor(self::$textColors['dark']):self::parseColor(self::$textColors['light']);
			$textColorDark = (self::luminance($dark) > 0.75)?self::parseColor(self::$textColors['dark']):self::parseColor(self::$textColors['light']);
			
			$fullColors[$k] = $color;
			$fullColors[$k . '_light'] = $light;
			$fullColors[$k . '_dark'] = $dark;

			$fullColors['text_' . $k] = $textColor;
			$fullColors['text_' . $k . '_light'] = $textColorLight;
			$fullColors['text_' . $k . '_dark'] = $textColorDark;
		}
		$fullColors['text'] = self::parseColor(self::$textColors['dark']);
		$fullColors['text_dark'] = self::parseColor(self::$textColors['dark']);
		$fullColors['text_light'] = self::parseColor(self::$textColors['light']);
		return $fullColors;
	}

	function replaceColors($data)
	{
		$colors = array('_color_primary', '#FF0000');

		$data = preg_replace_callback('/_color_([^,;} ]+)(?:,\s*([\d\.]+))?/', array($this, '_replaceColor'), $data);

		return $data;
	}

	private function _replaceColor($matches)
	{
		$response = '';
		$name = $matches[1];
		if(isset($this->colors[$name]))
		{
			$color = $this->colors[$name];
			if(isset($matches[2]))
			{
				$opacity = $matches[2];
				$response = "rgba({$color['r']}, {$color['g']}, {$color['b']}, {$opacity})";
			}else{
				$response = '#' . $color['hex'];
			}
		}
		return $response;
	}
}

// function replaceCMSColors($data)
// {
// 	$hardcodedColors = array(
// 		'_color_primary'=>''
// 	);
// 	$colors = Setting::getAll('_color_%');
// 	foreach($colors as $color)
// 	{
// 		$data = str_replace($color['name'], $color['value'], $data);
// 	}
// 	return $data;
// }
