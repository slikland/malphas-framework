<?php
namespace model\cms;
/**
*	@addToMenu("Usuário", 999, [1, 2, 3])
*/
class user extends Model
{

	/**
	*	@validate('user', 'min', 5)
	*	@validate('pass', 'min', 5)
	*/
	function login($data)
	{
		$user = $this->controller->login($data['user'], $data['pass']);
		if(!$user)
		{
			throw new AuthenticationError('not logged');
		}
		return array('__user'=>$user);
	}

	function logout()
	{
		$this->controller->logout();
		throw new AuthenticationError('not logged');
	}

	function ping()
	{
		return $this->getSession();
	}

	function getSession()
	{
		$session = $this->controller->getSession(False);
		if(!$session)
		{
			throw new AuthenticationError('not logged');
		}
		return TRUE;
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