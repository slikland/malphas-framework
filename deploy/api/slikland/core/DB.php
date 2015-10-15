<?php
namespace slikland\core;
class DB{
	private static $instance = NULL;
	public static function getInstance(){
		if(!self::$instance)
		{
			self::$instance = new DB();
		}
		return self::$instance;
	}

	function __construct($host = NULL, $user = NULL, $pass = NULL, $name = NULL)
	{
		global $db;

		if(is_null($host) && defined('DB_HOST'))
		{
			$host = DB_HOST;
		}

		if(is_null($user) && defined('DB_USER'))
		{
			$user = DB_USER;
		}

		if(is_null($pass) && defined('DB_PASS'))
		{
			$pass = DB_PASS;
		}

		if(is_null($name) && defined('DB_NAME'))
		{
			$name = DB_NAME;
		}

		$this->host = $host;
		$this->user = $user;
		$this->pass = $pass;
		$this->name = $name;
		$this->mysqli = NULL;
		if(!$db){
			$db = $this;
		}
	}

	public function initMySQLi()
	{
		if(!isset($this->mysqli))
		{
			$this->mysqli = new mysqli($this->host, $this->user, $this->pass, $this->name);
			$this->mysqli->query("SET NAMES 'utf8'");
		}
	}

	public function escapeString($string)
	{
		$this->initMySQLi();
		return $this->mysqli->real_escape_string($string);
	}

	public function query($sql, $params = NULL)
	{
		$this->initMySQLi();
		if(!$params)
		{
			return $this->mysqli->query($sql);;
		}else
		{
			$sql = preg_replace('/;+$/', '', $sql);
			$statement = $this->mysqli->prepare($sql);
			if(!$statement)
			{
				return FALSE;
			}
			$type = '';
			$values = array();
			foreach($params as $param)
			{
				if(is_array($param))
				{
					$type .= $param['type'];
					$values[] = $param['value'];
				}else{
					if(is_string($param))
					{
						$type .= 's';
					}else if(is_numeric($param))
					{
						$type .= 'd';
					}else
					{
						$type .= 's';
					}
					$values[] = $param;
				}
			}
			array_unshift($values, $type);
			foreach($values as $k=>$v)
			{
				$values[$k] = &$values[$k];
			}
			call_user_func_array(array($statement, 'bind_param'), $values);
			$statement->execute();
			return $statement;
		}
	}

	public function insert($sql, $params = NULL)
	{
		$result = $this->query($sql, $params);
		if($result)
		{
			if(is_bool($result))
			{
				return $this->mysqli->insert_id;
			}else{
				return $result->insert_id;
			}
		}
		return NULL;
	}

	public function insertFields($tableName, $fields)
	{

		$sql = 'INSERT INTO ' . $tableName;
		$columns = array();
		$params = array();
		$values = array();
		foreach($fields as $k=>$v)
		{
			$columns[] = '`' . $k .'`';
			$params[] = '?';
			$values[] = $v;
		}

		$sql .= ' (' . implode(', ', $columns) . ') VALUES (' . implode(', ', $params) . ');';
		return $this->insert($sql, $values);
	}

	public function updateFields($tableName, $fields, $condition)
	{
		$sql = 'UPDATE ' . $tableName . ' SET ';
		$columns = array();
		$params = array();
		$values = array();
		foreach($fields as $k=>$v)
		{
			if($v == 'NOW()')
			{
				$columns[] = '`' . $k .'` = NOW()';
			}else{

				$columns[] = '`' . $k .'` = ?';
				$values[] = $v;
			}
		}

		$sql .= implode(', ', $columns) . ' WHERE ' . $condition;
		return $this->query($sql, $values);
	}

	public function insertOrUpdate($table, $index, $keys, $data)
	{
		$where = array();
		foreach($keys as $key)
		{
			$where[] = "{$key} = '{$data[$key]}'";
		}
		$where = implode(' AND ', $where);
		$result = $this->fetch_one("SELECT {$index} id FROM {$table} WHERE {$where}");
		if($result)
		{
			$values = array();
			foreach($data as $k=>$v)
			{
				if($v == 'NOW()')
				{
					$values[] = "`{$k}`={$v}";
				}else
				{
					$values[] = "`{$k}`='{$v}'";
				}
			}
			$values = implode(', ', $values);

			$this->query("UPDATE {$table} SET {$values} WHERE {$index} = {$result['id']};");
			return $result['id'];
		}else
		{
			$keys = array();
			$values = array();
			foreach($data as $k=>$v)
			{
				$keys[] = "`{$k}`";
				if($v == 'NOW()')
				{
					$values[] = $v;
				}else
				{
					$values[] = "'{$v}'";
				}
			}
			$keys = implode(', ', $keys);
			$values = implode(', ', $values);
			return $this->insert("INSERT INTO {$table} ({$keys}) VALUES ({$values})");
		}
	}

	public function fetch_value($sql, $values = NULL)
	{
		$resource = $this->query($sql, $values);
		if(!$resource) return NULL;
		if($resource->num_rows == 0) return NULL;
		$row = $resource->fetch_array();
		return $row[0];
	}

	public function fetch_one($sql, $array = false)
	{
		$resource = $this->query($sql);
		if(!$resource) return NULL;
		if($resource->num_rows == 0) return NULL;
		if($array)
		{
			return $resource->fetch_array();
		}else
		{
			return $resource->fetch_assoc();
		}		
	}

	public function fetch_all($sql, $array = false)
	{
		$resource = $this->query($sql);
		$response = array();
		if($array)
		{
			while($row = $resource->fetch_array(MYSQLI_NUM))
			{
				$response[] = $row;
			}
		}else
		{
			while($row = $resource->fetch_assoc())
			{
				$response[] = $row;
			}
		}
		return $response;
	}
}
?>