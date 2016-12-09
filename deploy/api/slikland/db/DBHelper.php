<?php
namespace slikland\db;
class DBHelper
{
	private static $schemas = array();
	private static function getSchema($table)
	{
		if(!isset(self::$schemas[$table]))
		{
			$path = API_PATH . 'schema/' . $table . '.php';
			include_once($path);

			$schemaName = '_schema_' . $table;
			$data = $$schemaName;
			self::$schemas[$table] = $data;
		}
		return self::$schemas[$table];
	}

	private $table;
	private $view;
	private $schema;

	function __construct($tableName)
	{
		if(!preg_match('/^([^\.]+)(?:\.(.*?))?$/', $tableName, $match))
		{
			throw new Error('Table name is not defined');
		}

		$table = $match[1];
		$path = API_PATH . 'schema/' . $table . '.php';
		if(!file_exists($path))
		{
			throw new Error("`{$table}` schema not found");
		}

		$this->schema = self::getSchema($table);
		$this->table = $table;

		if(isset($match[2]) && !empty($match[2]))
		{
			$view = $match[2];
			if(!isset($schema['VIEWS'][$view]))
			{
				throw new Error("View `$view` not found in schema `$table`.");
			}
		}else{
			$view = 'default';
		}
		$this->view = $view;
	}

	//------------------------------------------------------------------------------
	// PUBLIC METHODS
	//------------------------------------------------------------------------------

	function get($viewName = NULL, $fields = NULL, $where = NULL, $order = NULL, $limit = NULL)
	{
		$db = db();
		$query = $this->buildSelectQuery($this->table, $this->view, $fields, array('email%'=>'%slik%'), array('id'), array(1));
		return $db->fetch_all($query['query'], $query['values']);
	}

	function paginate($data, $viewName = NULL, $fields = array(), $where = array(), $order = array())
	{
		$index = 0;
		$numItems = 20;
		$limit = array($index, $numItems);
		$items = $this->get($viewName, $fields, $where, $order, $limit);

		if(isset($data['_numItems']))
		{
			$numItems = $data['_numItems'];
			$index = $data['index'];
		}

		if(isset($data['search']))
		{
			$numItems = $data['_numItems'];
			$index = $data['index'];
		}

		$limit = array($index, $numItems);

		// public function getList($query, $params, $numItems = 20, $array = false)

		$total = $this->foundRows();
		return array('items'=>$items, 'total'=>$total, 'index'=>$index, 'numItems'=>$numItems);
	}

	function foundRows()
	{
		$db = db();
		return $this->fetch_value("SELECT FOUND_ROWS();") + 0;
	}

	function count($view = NULL)
	{
		if(!$view)
		{
			try{
				return $this->foundRows();
			}catch(\Exception $e)
			{

			}
		}

		$query = 'SELECT COUNT(`'.$this->table.'`.*) FROM ' . $this->table . ' ';

		$joins = array();
		$values = array();

		if($view)
		{
			$view = $this->schema['VIEWS'][$view];
			if(isset($view['where']))
			{
				$where = $this->buildWhereConditions($view['where'], $values, $joins);
				if($where)
				{
					$query .= ' WHERE ' .$where;
				}
			}
		}

		if(count($joins) > 0)
		{
			$join = array();
			foreach($joins as $v)
			{
				$join[] = "LEFT JOIN {$v} ON {$schema['REFS'][$v]}";
			}
			$query .= ' ' . implode($join, ' ');
		}
		$db = db();
		return $db->fetch_value($query, $values);
	}

	function exists($where)
	{
		$value = array();
		$joins = array();
		$where = $this->buildWhereConditions($where, $values, $joins);
		if($where)
		{
			$query = "SELECT 1 FROM {$this->table} WHERE " . $where . ' ';
			if(count($joins) > 0)
			{
				$join = array();
				foreach($joins as $v)
				{
					$join[] = "LEFT JOIN {$v} ON {$schema['REFS'][$v]}";
				}
				$query .= ' ' . implode($join, ' ');
			}
			$query .= ' LIMIT 1';
			$db = db();
			$found = $db->fetch_value($query, $values);
			if($found && $fonud == '1')
			{
				return TRUE;
			}
		}
		return FALSE;
	}

	function nextId()
	{
		$db = db();
		return $db->nextId($this->table);
	}

	function set($fields, $where = NULL)
	{
		$keys = array();
		$values = array();
		$joins = array();
		$valueRefs = array();

		$id = NULL;

		foreach($fields as $k=>$v)
		{
			preg_match('/^([^?]+)(\??)$/', $k, $match);
			$keys[] = '`' . $match[1] . '`';
			if($match[2] && !empty($match[2]))
			{
				$values[] = $v;
			}else{
				$values[] = '?';
				$valueRef[] = $v;
			}
			if(preg_match('/^pk_/', $k))
			{
				$id = array($k=>$v);
			}
		}

		$update = FALSE;
		$db = db();

		if(isset($where) && !empty($where))
		{
			$update = TRUE;
		}else if($id)
		{
			if($id)
			{
				if($this->exists($id))
				{
					if(!$where) $where = array();
					foreach($id as $k=>$v)
					{
						$where[$k] = $v;
					}
				}
			}
		}

		if($update)
		{
			$query = "UPDATE $this->table SET ";
			$cols = array_combine($keys, $values);
			foreach($cols as $k=>$v)
			{
				$query .= "{$k}={$v} ";
			}
			$where = $this->buildWhereConditions($where, $valueRefs, $joins);
			if($where)
			{
				$query .= 'WHERE ' . $where;
			}
			return $db->query($db, $valueRefs);

		}else{
			$query = "INSERT INTO this->table (".implode(',', $keys).") VALUES (".implode(',', $values).")";
			return $db->insert($db, $valueRefs);
		}

	}

	function delete($where = NULL)
	{
		if(!$where) return;

		$values = array();
		$joins = array();
		$where = $this->buildWhereConditions($where, $values, $joins);
		
		if(!$where) return;
		$query = "DELETE FROM {$this->table} ";
		if(count($joins) > 0)
		{
			$query .= ' ' . $query;
		}
		$query .= ' WHERE ' . $where;
		return $db->query($query, $values);
	}


	//------------------------------------------------------------------------------
	// 
	// PRIVATE METHODS
	// 
	//------------------------------------------------------------------------------


	private function buildSelectQuery($table, $view = NULL, $fields = NULL, $where = NULL, $order = NULL, $limit = NULL)
	{
		if(!$view)
		{
			$view = 'default';
		}

		$schema = $this->schema;
		$values = array();
		$query = 'SELECT ';

		$view = $schema['VIEWS'][$view];
		$columns = $schema['FIELDS'];
		$selectFields = array();
		if(isset($view['fields']) && !empty($view['fields']))
		{
			$columns = array_merge($columns, $view['fields']);
		}

		if(isset($fields) && !empty($fields))
		{
			foreach($fields as $field)
			{
				if(isset($columns[$field]))
				{
					$selectFields[$field] = $columns[$field];
				}else
				{
					$selectFields[$field] = TRUE;
				}
			}
		}else
		{
			if(isset($view['fields']) && !empty($view['fields']))
			{
				$selectFields = $view['fields'];
			}else if(isset($schema['FIELDS']))
			{
				$selectFields = $schema['FIELDS'];
			}else
			{
				throw new Error("Error on building select query for `$view`");
			}
		}

		if(!$where && isset($view['where']))
		{
			$where = $view['where'];
		}

		if(!$order && isset($view['order']))
		{
			$order = $view['order'];
		}

		if(!$limit && isset($view['limit']))
		{
			$limit = $view['limit'];
		}

		$fields = array();
		$joins = array();
		$join = NULL;

		foreach($selectFields as $k=>$v)
		{
			if(is_bool($v))
			{
				if(!$v)
				{
					continue;
				}
				$fields[] = "`{$table}`.`{$k}` as $k";
			}else if(is_string($v)){
				if(preg_match('/^(.*?)\.(.*?)$/', $v, $match))
				{
					if(!in_array($match[1], $joins))
					{
						if(!isset($schema['REFS'][$match[1]]))
						{
							continue;
						}
						$joins[] = $match[1];
					}
					$fields[] = "`{$match[1]}`.`{$match[2]}` as $k";
				}else{
					$fields[] = "`{$table}`.`{$v}` as $k";
				}
			}
		}
		$query .= implode($fields, ', ');
		$query .= ' FROM ' . $table;
		if(!empty($where))
		{
			$where = $this->buildWhereConditions($where, $values, $joins);

			if(strlen($where) > 0)
			{
				$where = ' WHERE ' . $where;
			}else
			{
				$where = NULL;
			}
		}

		if(!empty($order))
		{
			$order = $this->buildOrderClause($order);
		}

		if(!empty($limit))
		{
			$limit = $this->buildLimitClause($limit);
		}

		if(count($joins) > 0)
		{
			$join = array();
			foreach($joins as $v)
			{
				$join[] = "LEFT JOIN {$v} ON {$schema['REFS'][$v]}";
			}
			$join = ' ' . implode($join, ' ');
		}else{
			$join = NULL;
		}


		if($join) $query .= $join;
		if($where) $query .= $where;
		if($order) $query .= $order;
		if($limit){
			$query .= $limit;
			if(!preg_match('/^\\s*SELECT\\s+SQL_CALC_FOUND_ROWS/i', $query))
			{
				$query = preg_replace('/^\\s*SELECT/', 'SELECT SQL_CALC_FOUND_ROWS', $query);
			}
		}


		return array('query'=>$query, 'values'=>$values);
	}

	private function buildWhereConditions($items, &$values, &$joins)
	{
		$where = '';
		foreach($items as $k=>$v)
		{

			if(!preg_match('/^([\&\|]?)([^\!\>\<\=\%\?]*)([\!\>\<\=\%\?]{0,2})$/', $k, $match))
			{
				continue;
			}
			switch($match[1])
			{
				case '|':
					$where .= ' ||| ';
					break;
				default:
					$where .= ' &&& ';
					break;
			}
			if(isAssoc($v))
			{
				$where .= '(' . $this->buildWhereConditions($v, $values, $joins, FALSE) . ')';
			}else{
				if(empty($match[2]) && $match[3] != '?')
				{
					continue;
				}
				preg_match('/^(?:([^\.])+\.)?([^\.]+)/', $match[2], $nameMatch);
				if(empty($nameMatch[1]))
				{
					$table = $this->table;
				}else{
					$table = $nameMatch[1];
				}

				if($table != $this->table && !in_array($table, $joins))
				{
					if(!isset($this->schema['REFS'][$table]))
					{
						continue;
					}
					$joins[] = $table;
				}
				$name = "`{$table}`.`{$match[2]}`";
				$value = $v;
				$cond = ' ' . $name;
				if(is_array($value))
				{
					$cond .= ' IN (' . array_fill(0, count($value), '?');
					array_unshift($value, $values);
					call_user_func_array('array_push', $value);
				}else{

					switch($match[3])
					{
						case '!':
							$cond .= ' != ';
							break;
						case '>':
						case '<':
						case '>=':
						case '<=':
							$cond .= " {$match[3]} ";
							break;
						case '!%':
							$cond .= " NOT";
						case '%':
							$cond .= " LIKE ";
							break;
						case '?':
							if(empty($match[2]))
							{
								$cond = $value;
								$value = NULL;
							}else{
								$cond .= " = " . $value;
								$value = NULL;
							}
							break;
						default:
							$cond .= " = ";
							break;

					}
					if(!is_null($value))
					{
						$cond .= '?';
						$values[] = $value;
					}
					$where .= $cond;
				}
			}
		}
		if($where)
		{
			$where = $this->clearWhereConditions($where);
		}
		return $where;
	}

	private function clearWhereConditions($where)
	{
		$where = trim($where);
		$where = trim($where, '&');
		$where = trim($where, '|');
		$where = trim($where);
		$where = preg_replace('/\&\&\&/', 'AND', $where);
		$where = preg_replace('/\|\|\|/', 'OR', $where);
		return $where;
	}

	private function buildOrderClause($items)
	{
		$orders = array();


		foreach($items as $item)
		{
			$dir = 'ASC';

			preg_match('/^(\-?)(.*?)$/', $item, $match);
			$value = $match[2];
			if(isset($match[1]) && !empty($match[1]))
			{
				$dir = 'DESC';
			}
			$orders[] = '`'.$value.'` ' . $dir;
		}

		if(count($orders) > 0)
		{
			return ' ORDER BY ' . implode(', ', $orders);
		}
		
		return NULL;
	}

	private function buildLimitClause($items)
	{
		$limit = NULL;
		if(is_array($items) && count($items) > 0)
		{
			$items = array_splice($items, 0, 2);
			$limit = ' LIMIT ' . implode(', ', $items);
		}else if(is_numeric($items))
		{
			$limit = ' LIMIT ' . $items;
		}

		return $limit;
	}


}