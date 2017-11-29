<?php
namespace slikland\service;

class setup{
	// /**
	// @output
	// 	html
	// */
	// function index()
	// {
	// 	print 123;
	// }

	// /**
	// @output text
	// */
	// function test()
	// {
	// 	$users = new \slikland\db\DBHelper('cms_user');
	// 	var_dump($users->get());
	// 	// return $users->count();
	// 	return $users;
	// }

	/**
	@output
		html
	*/
	function user()
	{
		$db = db();
		$numUsers = $db->fetch_value('SELECT COUNT(*) FROM cms_user');
		if($numUsers > 0) return;

		return '<form action="'.API_URL.'setup/registerUser" method="POST" target="_blank"><textarea name="roles"></textarea><br><input type="password" name="password" placeholder="password" /><br><input type="text" name="name" placeholder="name" /><br><input type="text" name="email" placeholder="email" /><br><input type="password" name="pass" placeholder="password" /><br><button>SUBMIT</button></form>';
	}

	/**
	@output
		html
	@method
		POST
	*/
	function registerUser($data)
	{
		$db = db();
		$userModule = get_module('cms/User');
		$numUsers = $db->fetch_value('SELECT COUNT(*) FROM cms_user');
		if($numUsers > 0) return;
		if($data['password'] != 'VC)!N||sadkn2k34') return;
		$roles = preg_split('/\n+/', $data['roles']);

		$db->query('DELETE FROM cms_role WHERE pk_cms_role > 0');
		$c = 1;
		foreach($roles as &$role)
		{
			if(!empty(trim($role)))
			{
				$role = trim($role);
				if(!$db->fetch_value('SELECT 1 FROM cms_role WHERE name LIKE ?', array($role)))
				{
					$db->insert('INSERT INTO cms_role (pk_cms_role, name) VALUES (?, ?);', array($c++, $role));
				}
			}
		}
		$pass = trim($data['pass']);
		$name = trim($data['name']);
		$email = trim($data['email']);
		$role = 1;
		$db->query('LOCK TABLES cms_user write, cms_interface write, cms_interface_role write');
		$nextID = $db->nextId('cms_user');
		$checksum = $userModule->getRoleChecksum($nextID, $role);
		$insertID = $db->insert('INSERT INTO cms_user (pk_cms_user, name, email, pass, fk_cms_role, checksum) VALUES (?, ?, ?, ?, ?, ?)', array($nextID, $name, $email, password($pass, $nextID), $role, $checksum));
		$interfaceId = $db->insert('INSERT INTO cms_interface (name, `path`, visible, type) VALUES ("Interface", "cms/interface", 1, "config")');
		$db->insert('INSERT INTO cms_interface_role (fk_cms_interface, fk_cms_role) VALUES (?, 1)', array($interfaceId));
		$db->query('UNLOCK TABLES;');
	}

	/**
	@output json
	@afilename 2test.yaml
	*/
	function exportDB()
	{
		global $config;
		if(!File::isWritable(API_PATH . 'schema/'))
		{
			throw new ServiceError('Please change permission of ' . API_PATH . 'schema/');
		}
		$schema = new \slikland\db\SchemaParser();
		$data = $schema->parseTables();
		include_once('vendors/Spyc.php');
		// outputFileName('SomeName.yaml');
		// spyc_dump($data);
		foreach($data as $k=>$v)
		{
			$sql = $schema->generateCreateSchema($k, $v);
			// print($sql);
			// print "\n\n\n\n";
		}
		$schema->exportTables($data);
		// return var_export($data);
		// return $data;
		// return spyc_dump($data);
	}

	function syncDB()
	{

	}
}

// get(array('a','b','c'));
// get(array('a','b','c'), array('pk_user'=>1));
// get(array('pk_user'=>1));
// get(array('pk_user'=>1));
// get(
// 	array(
// 		"fields"=>array(),
// 		"where"=>array(),
// 		"order"=>array('name','asd','asd'),
// 		"limit"=>array(1,10),
// 		)
// );
