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
			throw new Error('user not found');
		}
		return array('__user'=>$user);
	}

	function logout()
	{
		$this->controller->logout();
		throw new Error('not logged');
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
			throw new Error('not logged');
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
		$currentUser = $this->controller->getCurrentUser();
		$roles = $this->controller->getRoles($currentUser['role']);
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
		if($currentUser['role'] > $user['role'])
		{
			throw new Error('no permission');
		}
		$roles = $this->controller->getRoles($currentUser['role']);
		foreach($roles as &$role)
		{
			$role['selected'] = ($user['role'] == $role['value'])?true:false;
		}
		$response['roles'] = $roles;
		$response['name'] = $user['name'];
		$response['email'] = $user['email'];
		$response['id'] = $user['id'];
		$response['submitLabel'] = "Editar";
		$response['pass'] = "-----";
		return $response;
	}

	/**
	*	@validate(["name","email","pass"], "required")
	*	@validate(["name"], "length", {"min":5, "max":255})
	*	@validate(["pass"], "length", {"min":5, "max":24})
	*	@validate(["email"], "email")
	*	@permission([1, 2])
	*/
	function edit($data)
	{
		$response = array();
		$fields = array();


		$insert = false;
		$type = 'edit';
		if(!isset($data['id']) || empty($data['id']))
		{
			$insert = true;
			$type = 'add';
		}else{
			$fields['id'] = $data['id'];
		}
		$fields['name'] = $data['name'];
		$fields['email'] = $data['email'];
		if(isset($data['pass']) && !empty($data['pass']) && !preg_match('/^\-+$/', $data['pass']))
		{
			$fields['pass'] = $data['pass'];
		}
		$fields['role'] = $data['role'];
		if(!isset($fields['id']) && !isset($fields['pass']))
		{
			throw new Error('validation', array(array('field'=>'pass', 'message'=>\slikland\utils\Validation::getMessage('required', array()))));
		}
		if($this->controller->editUser($fields))
		{
			$response['notification'] = new Notification($type.' user success');
			$response['goto'] = 'user/listUsers';
		}else{
			throw new Error('notification', $type . ' user error');
		}
		return $response;
	}

	/**
	*	@addToMenu("Log dos usuários", 0, [1])
	*	@permission([1])
	*	@log(0)
	*/
	function listLog($data)
	{
		return array('items'=>$this->logList($data));
	}

	/**
	*	@log(0)
	*/
	function logList($data = array())
	{
		if(!isset($data['sort'])){
			$data['sort'] = '-created';
		}
		return $this->controller->getLog($data);
	}
	/**
	*	@permission([1, 2])
	*/
	function removeUser($data)
	{
		$user = $this->controller->getUser($data[0]);
		$currentUser = $this->controller->getCurrentUser();
		if($currentUser['role'] > $user['role'])
		{
			throw new Error('no permission');
		}
		$response = array();
		if($this->controller->removeUser($data[0]))
		{
			$response['notification'] = new Notification('remove user success');
			$response['goto'] = 'user/listUsers';
		}else{
			throw new Error('notification', 'remove user error');
		}
		return $response;
	}
}
?>