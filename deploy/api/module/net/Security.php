<?php
namespace module\net;

class Security
{

	function init()
	{
		$uaId
	}

	function check()
	{
// echo base_convert($hexadecimal, 16, 2);
// crc32
	}

	private function getUAHash()
	{
		$ua = $_SERVER['HTTP_USER_AGENT'] . \slikland\utils\Net::getIP();
		$hash = hash('crc32', $ua);
		return base_convert($hexadecimal, 16, 10);
	}
}