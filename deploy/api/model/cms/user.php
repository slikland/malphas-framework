<?php
namespace model\cms;
/**
*	@addToMenu("Usuários", 9999, [1, 2])
*/
class user extends Model
{

	/**
	*	@validate("user", "min", 5)
	*	@validate("pass", "min", 5)
	*	@log(null, null, "")
	*/
	function login($data)
	{
		$user = $this->controller->login($data['user'], $data['pass']);
		if(!$user)
		{
			throw new ServiceError('User not found');
			// throw new AuthenticationError('not logged');
		}
		return array('__user'=>$user);
	}

	function logout()
	{
		$this->controller->logout();
		throw new AuthenticationError('not logged');
	}

	/**
	*	@permission()
	*	@log(0)
	*/
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
	*	@permission([1, 2])
	*/
	function listUsers()
	{
		$users = $this->controller->getUserList();
		return array('users'=>$users);
	}

	/**
	*	@addToMenu("Adicionar usuário", 0, [1, 2])
	*	@permission([1, 2])
	*/
	function addUser()
	{
		$response = array();
		$roles = $this->controller->getRoles();
		foreach($roles as &$role)
		{
			$role['selected'] = 0;
		}
		$response['roles'] = $roles;
		$response['submitLabel'] = "Adicionar";
		return $response;
	}

	/**
	*	@permission([1, 2])
	*/
	function editUser($data)
	{
		$response = array();
		$user = $this->controller->getUser($data[0]);
		$currentUser = $this->controller->getCurrentUser();
		if($currentUser['role'] < $user['role'])
		{
			throw new AuthenticationError('no permission');
		}
		$roles = $this->controller->getRoles();
		foreach($roles as &$role)
		{
			$role['selected'] = ($user['role'] == $role['value'])?true:false;
		}
		$response['roles'] = $roles;
		$response['name'] = $user['name'];
		$response['email'] = $user['email'];
		$response['id'] = $user['id'];
		$response['submitLabel'] = "Editar";
		return $response;
	}

	/**
	*	@permission([1, 2])
	*/
	function edit($data)
	{
		$insert = false;
		if(!isset($data['id']) || empty($data['id']))
		{
			$insert = true;
		}
		$response = array();
		$fields = array();
		$fields['name'] = $data['name'];
		$fields['email'] = $data['email'];
		if(isset($data['password']) && !empty($data['password']) && !preg_match('/^\-+$/', $data['password'])){

			$fields['password'] = $data['password'];
		}
		$fields['fk_role'] = $data['role'];
		if($insert)
		{
			if(!isset($fields['password']))
			{
				throw new ServiceError('bla');
			}
			$this->addUser($fields);
		}else{
			$this->editUser($fields);
		}
		return $response;
	}

	/**
	*	@addToMenu("Log dos usuários", 0, [1])
	*	@permission([1])
	*/
	function listLog()
	{

		return array('items'=>$this->logList());
	}

	function logList($data = array())
	{
		return $this->controller->getLog($data);
	}
}
?>