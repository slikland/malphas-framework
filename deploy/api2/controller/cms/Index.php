<?php
namespace controller\cms;
class Index extends Controller
{
	function isLogged()
	{

	}
	
	function getUser()
	{
		return new controller\cms\User();
	}

	function getInterface()
	{

	}
}
?>