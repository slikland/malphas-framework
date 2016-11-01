<?php
namespace slikland\db;
class DB{
	private static $instance = NULL;
	public static function getInstance($host = NULL, $user = NULL, $pass = NULL, $name = NULL, $port = NULL){
		if(!self::$instance)
		{
			self::$instance = new DB($host, $user, $pass, $name, $port);
		}
		return self::$instance;
	}

	function __construct($host = NULL, $user = NULL, $pass = NULL, $name = NULL, $port = NULL)
	{
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

		if(is_null($port))
		{
			$port = 3306;
		}

		$this->host = $host;
		$this->user = $user;
		$this->pass = $pass;
		$this->name = $name;
		$this->port = $port;
		$this->mysqli = NULL;
	}

	public function error()
	{
		return $this->mysqli->error;
	}

	public function initMySQLi()
	{
		if(!isset($this->mysqli))
		{
			$this->mysqli = new \mysqli($this->host, $this->user, $this->pass, $this->name, $this->port);
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
			if(preg_match('/^(NOW|PASSWORD)\((.*?)\)/i', $v, $match))
			{
				if(isset($match[2]) && !empty($match[2]))
				{
					$params[] = $match[1] . '(?)';
					$values[] = $match[2];
				}else{
					$params[] = $v;
				}
			}else{
				$params[] = '?';
				$values[] = $v;
			}

			$columns[] = '`' . $k .'`';
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
			if(preg_match('/^(NOW|PASSWORD)\((.*?)\)/i', $v, $match))
			{
				if(isset($match[2]) && !empty($match[2]))
				{
					$columns[] = '`' . $k .'` = ' . $match[1] . '(?)';
					$values[] = $match[2];
				}else{
					$columns[] = '`' . $k .'` = ' . $v;
				}
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

	public function fetch_value($sql, $params = NULL)
	{
		$resource = $this->query($sql, $params);
		if(!$resource) return NULL;
		if($resource->num_rows == 0) return NULL;
		$row = $resource->fetch_array();
		return $row[0];
	}

	public function fetch_one($sql, $params = NULL, $array = false)
	{
		$resource = $this->query($sql, $params);
		if(!$resource) return NULL;
		if($resource->num_rows == 0) return NULL;
		if($array)
		{
			return $resource->fetch_array(MYSQLI_NUM);
		}else
		{
			return $resource->fetch_assoc();
		}		
	}

	public function fetch_all($sql, $params = NULL, $array = false)
	{
		$resource = $this->query($sql, $params);
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

	public function getList($query, $params, $numItems = 20, $array = false)
	{
		if(is_null($numItems))
		{
			$numItems = 20;
		}
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
				$fields = explode(',', $fields);
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

		$filters = array();
		foreach($params as $k=>$v)
		{
			if(preg_match('/^filter_(.+)$/', $k, $filterName))
			{
				if(is_array($v)){
					$filters[] = $filterName[1] . ' IN("' . implode('", "', $v) . '")';
				}else{
					$filters[] = $filterName[1] . ' = "' . $v . '"';
				}
			}

		}
		if(isset($params['filter']))
		{
			foreach($params['filter'] as $filter)
			{
				if(!isset($filter['fields']))
				{
					continue;
				}
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
		}
		if(count($filters) > 0)
		{
			$where[] = implode(' AND ', $filters);
		}

		if(isset($params['where']))
		{
			$filters = array();
			if(is_array($params['where']))
			{
				$where[] = implode(' AND ', $params['where']);
			}else if(is_string($params['where']))
			{
				$where[] = $params['where'];
			}
		}

		$orders = array();
		if(isset($params['sort']))
		{
			$sorts = $params['sort'];
			if(!is_array($sorts))
			{
				$sorts = explode(',', $sorts);
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

		if(isset($params['group']) && !empty($params['group'])){
			$query[] = 'GROUP BY ' . $params['group'];
		}

		if(count($orders) > 0)
		{
			$query[] = 'ORDER BY ' . implode(', ', $orders);
		}
		if($numItems > 0)
		{
			$query[] = 'LIMIT ' . $index .', ' . $numItems;
		}

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