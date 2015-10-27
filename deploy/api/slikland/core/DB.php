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
			$this->mysqli = new \mysqli($this->host, $this->user, $this->pass, $this->name);
			$this->mysqli->query("SET NAMES 'utf8'");
		}
	}

	public function escapeString($string)
	{
		$this->initMySQLi();
		return $this->mysqli->real_escape_string($string);
	}

	public function multi_query($sql)
	{
		$this->initMySQLi();
		$results = array();
		if ($this->mysqli->multi_query($sql)) {
			do {
				if ($result = $this->mysqli->store_result()) {
					while ($row = $result->fetch_row()) {
						$results[] = $row[0];
					}
					$result->free();
				}
				if ($this->mysqli->more_results()) {
				}else{
					break;
				}
			} while ($this->mysqli->next_result());
		}
		return $results;
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

	public function getList($query, $params, $array = false)
	{
		$numItems = 10;
		$index = 0;
		if(isset($params['pagination']))
		{
			$numItems = $params['pagination']['numItems'];
			$index = $params['pagination']['index'];
		}
		$query = array($query);
		$where = array();

		if(isset($params['search']))
		{
			$fields = $params['search']['fields'];
			if(!is_array($fields))
			{
				$fields = array($fields);
			}
			// $fields = implode(' OR ', $fields);
			$value = $params['search']['value'];
			$values = array();

			preg_match_all('/([\'"])(.+)\1/', $value, $matches);
			foreach($matches[2] as $match)
			{
				$values[] = '"%' . $match . '%"';
			}
			$value = preg_replace('/([\'"])(.+)\1/', '', $value);
			preg_match_all('/([^\s]+)/', $value, $matches);
			foreach($matches[1] as $match)
			{
				$values[] = '"%' . $match . '%"';
			}

			$searches = array();
			foreach($values as $value){
				if(strlen(trim($value)) <= 0)
				{
					continue;
				}
				$search = array();
				foreach($fields as $field)
				{
					$search[] = $field . ' LIKE ' . $value;
				}
				$searches[] = '(' . implode(' OR ', $search) . ')';
			}
			if(count($searches) > 0)
			{
				$where[] = implode(' AND ', $searches);
			}
		}

		if(isset($params['filter']))
		{
			$filters = array();
			foreach($params['filter'] as $filter)
			{
				$fields = $filter['fields'];
				if(!is_array($fields))
				{
					$fields = array($fields);
				}
				$fields = implode(' AND ', $fields);
				$value = $filter['value'];
				if(is_array($value)){
					$filters[] = $fields . ' IN("' . implode('", "', $value) . '")';
				}else{
					$filters[] = $fields . ' = "' . $value . '"';
				}
			}
			$where[] = implode(' AND ', $filters);
		}

		$orders = array();
		if(isset($params['sort']))
		{
			$sorts = $params['sort'];
			if(!is_array($sorts))
			{
				$sorts = array($sorts);
			}

			foreach($sorts as $sort)
			{
				$dir = 'ASC';
				if(is_string($sort))
				{
					preg_match('/^(\-?)(.*?)$/', $sort, $match);
					$value = $match[2];
					if(isset($match[1]) && !empty($match[1]))
					{
						$dir = 'DESC';
					}
				}else{
					$value = $sort['field'];
					if(isset($sort['dir']) && $sort['dir'] < 0)
					{
						$dir = 'DESC';
					}else if(isset($sort['desc'])){
						$dir = 'DESC';
					}
				}
				$orders[] = '`'.$value.'` ' . $dir;
			}
		}

		if(count($where) > 0)
		{
			$query[] = 'WHERE ' . implode(' AND ', $where);
		}

		if(count($orders) > 0)
		{
			$query[] = 'ORDER BY ' . implode(', ', $orders);
		}

		$query[] = 'LIMIT ' . $index .', ' . $numItems;

		$query = implode(' ', $query);

		if(!preg_match('/^\\s*SELECT\\s+SQL_CALC_FOUND_ROWS/i', $query))
		{
			$query = preg_replace('/^\\s*SELECT/', 'SELECT SQL_CALC_FOUND_ROWS', $query);
		}


		$resource = $this->query($query);
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

		$total = $this->fetch_value("SELECT FOUND_ROWS();") + 0;

		return array('items'=>$response, 'total'=>$total, 'index'=>$index, 'numItems'=>$numItems);
	}
}
?>