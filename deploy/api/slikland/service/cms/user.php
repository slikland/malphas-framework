<?php
namespace slikland\service\cms;
class user
{
	function __construct()
	{
		$this->module = get_module('cms/User');
	}

	/**
	@method POST
	@log login
	*/
	function login($data)
	{
		$user = $this->module->login($data['email'], $data['pass']);
		if(!$user)
		{
			throw new CodedError('login_error');
		}
		return $user;
	}

	/**
	@method POST
	*/
	function logout($data)
	{
		return $this->module->logout();
	}

	function getUser($data)
	{
		$id = NULL;
		if(isset($data))
		{
			if(isset($data['id']) && !empty($data['id']))
			{
				$id = $data['id'];
			}else if(isset($data[0]) && !empty($data[0]))
			{
				$id = $data[0];
			}
		}
		$currentUser = $this->module->getCurrent();
		if(!$id)
		{
			$user = $currentUser;
			if(!$user)
			{
				throw new CodedError('not_logged');
			}
		}else{
			$user = $this->module->get($id);
			if(!$user)
			{
				throw new CodedError('user_not_found');
			}
			if($user['role'] < $currentUser['role'])
			{
				throw new CodedError('permission_error');
			}
			$roles = $this->module->getRoles();
			foreach($roles as &$role)
			{
				if($role['id'] == $user['role'])
				{
					$role['selected'] = 1;
				}else{
					$role['selected'] = NULL;
				}
			}
			$user['roles'] = $roles;
		}
		return $user;
	}

	function getUsers($data)
	{
		$roles = $this->module->getRoles();
		$response = array();
		$items = array();
		foreach($roles as $role)
		{
			$roleData = array();
			$roleData['name'] = $role['name'];
			$users = $this->module->getList($data, $role['id']);
			$roleData['items'] = $users['items'];
			$items[] = $roleData;
		}
		return array('items'=>$items);
	}

	function getRoles()
	{
		return $this->module->getRoles();
	}

	/**
	@log Edição de usuário
	*/
	function edit($data)
	{
		$response = array();
		if(!isset($data['id']) || empty($data['id']) || !is_numeric($data['id']) || $data['id'] == 0)
		{
			$response = $this->module->add($data['name'], $data['email'], $data['password'], $data['role']);
		}else{
			$response = $this->module->edit($data['id'], $data['name'], $data['email'], $data['password'], $data['role']);
		}
		return $response;
	}

	/**
	@log Remoção de usuário
	*/
	function remove($data)
	{
		$response = FALSE;
		$id = NULL;
		if(isset($data))
		{
			if(isset($data['id']) && !empty($data['id']))
			{
				$id = $data['id'];
			}else if(isset($data[0]) && !empty($data[0]))
			{
				$id = $data[0];
			}
		}
		if($id)
		{
			$response = $this->module->remove($id);
		}
		return $response;
	}

	/**
	// @method POST
	*/

	function getLog($data)
	{
		$list = $this->module->getLog($data);
		$list['params'] = $data;
		return $list;
	}

}