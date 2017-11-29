<?php
namespace slikland\crypt;

class Philo
{

	static $_chars = NULL;
	private static function chars()
	{
		if(!static::$_chars)
		{
			$charCodes = [[33, 59], [63, 126], [161, 172], [174, 255]];
			$chars = [];
			foreach($charCodes as $cc)
			{
				foreach(range($cc[0], $cc[1]) as $i)
				{
					$chars[] = utf8_encode(chr($i));
				}
			}
			static::$_chars = $chars;
		}
		return static::$_chars;
	}

	static function encode($value)
	{
		$vl = strlen($value);
		$ts = ((time() % (365.25 * 24 * 60 * 60)) / (60 * 60 * 24)) >> 0;

		$chars = static::chars();

		$bi = 0;
		$bytes = [];
		$bytes[$bi++] = ($vl >> 0) & 0xFF;
		$bytes[$bi++] = ($vl >> 8) & 0xFF;
		$bytes[$bi++] = ($vl >> 16) & 0xFF;
		$bytes[$bi++] = ($vl >> 24) & 0xFF;
		$bytes[$bi++] = $ts & 0xFF;
		$bytes[$bi++] = ($ts >> 8) & 0xFF;

		$i = -1;
		$bin = '';
		$vChars = str_split($value);
		$l = count($vChars);
		while(++$i < $l)
		{
			$bytes[$bi++] = ord($vChars[$i]);
		}

		$i = -1;
		$l = count($bytes);
		while(++$i < $l)
		{
			$b = decbin($bytes[$i]);
			$bin .= str_pad($b, 8, '0', STR_PAD_LEFT);
		}

		$cl = count($chars);
		$skipper = rand(0, $cl - 1);
		$sider = rand(0, $cl - 1);
		$siderStr = str_pad(decbin($sider), 8, '0', STR_PAD_LEFT);

		$si = $skipper;
		$i = 0;
		$l = strlen($bin);
		$c = 0;
		$res = '';
		while($i < $l)
		{
			$b = str_pad(substr($bin, $i, 7), 7, '0', STR_PAD_RIGHT);
			$sn = (($sider >> ($c % 8) & 1) << 1) - 1;
			$b = bindec($b) + $si * $sn;

			$b = ((($b % $cl) + $cl) % $cl);
			$si = $b % $cl;
			$res .= $chars[$b];
			$i += 7;
			$c++;
		}

		$res = $chars[$skipper] . $res . $chars[$sider];
		return $res;
	}

	static function decode($value)
	{
		if(!$value) return;
		$chars = static::chars();
		$cl = count($chars);
		$charIndex = array_combine(array_values($chars), array_keys($chars));

		$vcs = preg_split('//u', $value, -1, PREG_SPLIT_NO_EMPTY);
		$skipper = $charIndex[$vcs[0]];
		$sider = $charIndex[$vcs[count($vcs) - 1]];

		$vcs = array_splice($vcs, 1, count($vcs) - 2);

		$si = $skipper;
		$bin = '';
		$cs = [];

		$bin = '';

		foreach($vcs as $k=>$c)
		{
			$b = $charIndex[$c];
			$sn = ((((($sider >> ($k % 8)) & 1) << 1) - 1) * -1) * $si;
			$si = $b;
			$b = $b + $sn;
			$b = ((($b % $cl) + $cl) % $cl) % 0x80;
			$b = str_pad(decbin($b), 7, '0', STR_PAD_LEFT);
			$bin .= $b;
		}

		$ba = [];
		while(strlen($bin) > 0)
		{
			$b = substr($bin, 0, 8);
			$bin = substr($bin, 8);
			$ba[] = bindec(str_pad($b, 8, '0', STR_PAD_RIGHT));
		}
		if(count($ba) < 6) return;
		$l = $ba[3] << 24 | $ba[2] << 16 | $ba[1] << 8 | $ba[0];
		$ts = $ba[5] << 8 | $ba[4];

		$cts = ((time() % (365.25 * 24 * 60 * 60)) / (60 * 60 * 24)) >> 0;

		if(abs($cts - $ts) > 1) return NULL;

		$ba = array_splice($ba, 6);

		$str = '';
		$i = -1;
		while(++$i < $l)
		{
			$str .= utf8_encode(chr($ba[$i]));
		}
		return $str;
	}

}