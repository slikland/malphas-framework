<?php
namespace model\cms;
/**
*	@addToMenu("Usuário", 999, [1, 2, 3])
*/
class user extends Model
{
	function login()
	{
		// $this->controller->login();
		return 1;
	}

	function logout()
	{

	}

	function getSession()
	{

	}

	/**
	*	@addToMenu("Lista de usuários", 0, [1, 2])
	*/
	function listUsers()
	{

	}

	/**
	*	@addToMenu("Adicionar usuário", 0, [1, 2])
	*/
	function addUser()
	{

	}
}
?>