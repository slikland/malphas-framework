<?php
namespace module\net;
class GeoIP
{
	function __construct()
	{
		require_once('vendores/geoip2.phar');
		// include_once('vendors/maximind-geoip/src/geoip.inc');
		// include_once('vendors/maximind-geoip/src/geoipcity.inc');
		// $this->_geoip = geoip_open(API_PATH . 'vendors/maximind-geoip/data/GeoIP.dat', GEOIP_STANDARD);
		// $this->_geoip = geoip_open(API_PATH . 'vendors/maximind-geoip/data/GeoLiteCity.dat', GEOIP_STANDARD);
	}

	function getCountry($ip = NULL)
	{
		if(!$ip)
		{
			$ip = \slikland\utils\Net::getIP();
		}
		$response = array();
		if(preg_match('/\:/', $ip))
		{
			$response['name'] = geoip_country_name_by_addr_v6($this->_geoip, $ip);
			$response['code'] = geoip_country_code_by_addr_v6($this->_geoip, $ip);
		}else{
			$response['name'] = geoip_country_name_by_addr($this->_geoip, $ip);
			$response['code'] = geoip_country_code_by_addr($this->_geoip, $ip);

		}
		return $response;
	}

	function getCity($ip = NULL)
	{
		if(!$ip)
		{
			$ip = \slikland\utils\Net::getIP();
		}
		$response = array();
		if(preg_match('/\:/', $ip))
		{
			$response['name'] = geoip_country_name_by_addr_v6($this->_geoip, $ip);
			$response['code'] = geoip_country_code_by_addr_v6($this->_geoip, $ip);
		}else{
			$response['name'] = geoip_country_name_by_addr($this->_geoip, $ip);
			$response['code'] = geoip_country_code_by_addr($this->_geoip, $ip);

		}
		return $response;
	}
}