<?php
namespace slikland\db;
class DBQueryBuilder
{

	private static $_schema;
	private static $_table;
	private static $_fields;
	private static $_refs;
	private static $_usedRefs;
	private static $_usedFields;
	private static $_schemas = array();

	public static function setSchema($schema)
	{
		if(preg_match('/^([^\.]+)\.([^\.]+)$/', $schema, $match))
		{
			$schema = $match[1];
			$viewName = $match[2];
		}
		else
		{
			$viewName = 'default';
		}

		self::$_schema = $schema;
		self::parseSchema($schema, $viewName);
	}

	public static function select($schema, $fields = NULL, $where = NULL, $order = NULL, $limit = NULL)
	{
		self::reset();
		if(preg_match('/^([^\.]+)\.([^\.]+)$/', $schema, $match))
		{
			$schema = $match[1];
			$viewName = $match[2];
		}
		else
		{
			$viewName = 'default';
		}

		self::$_schema = $schema;

		$schemaData = self::parseSchema($schema, $viewName);

		if($fields)
		{
			if(!isAssoc($fields))
			{
				$fields = array_combine($fields, array_fill(0, count($fields), TRUE));
			}
		}else{
			$fields = $schemaData['fields'];
		}

		$refs = array();
		$values = array();
		$selectFields = array();

		foreach($fields as $k => $v)
		{
			if(!$v){
				continue;
			}
			if(is_string($v))
			{
				if(preg_match('/\?$/', $k))
				{
					$selectFields[] = "{$v} as `" . preg_replace('/\?$/', '', $k) . '`';
					continue;
				}else{
					$fieldData = self::getField($v);
					$fieldData['alias'] = $k;
				}
			}else{
				$fieldData = self::getField($k);
			}
			if(!$fieldData)
			{
				continue;
			}

			$selectFields[] = "`{$fieldData['schema']}`.`{$fieldData['field']}` as `{$fieldData['alias']}`";

			if(isset($fieldData['ref']) && !empty($fieldData['ref']))
			{
				if(!isset($refs[$fieldData['schema']]))
				{
					$refs[$fieldData['schema']] = $fieldData['ref'];
				}
			}
		}

		if(!$where)
		{
			$where = array();
		}else{
			if(!is_array($where))
			{
				$where = array($where);
			}
		}

		$where = array_merge($where, $schemaData['where']);

		if(!$order)
		{
			$order = $schemaData['order'];
		}

		if(!$limit)
		{
			$limit = $schemaData['limit'];
		}

		if($where && !empty($where))
		{
			$where = self::buildWhereConditions($where, $values, $refs);
		}else{
			$where = NULL;
		}

		if($order && !empty($order))
		{
			$order = self::buildOrderClause($order);
		}else{
			$order = NULL;
		}

		if($limit && !empty($limit))
		{
			$limit = self::buildLimitClause($limit);
		}else{
			$limit = NULL;
		}


		$query = 'SELECT ';

		$query .= implode(', ', $selectFields) . ' ';

		$query .= 'FROM ' . $schema .' ';

		$joins = array();
		foreach($refs as $k=>$v)
		{
			$joins[] = "LEFT JOIN {$k} ON {$v}";
		}
		$query .= implode(' ', $joins) . ' ';

		if($where){
			$query .= 'WHERE ' . $where . ' ';
		}

		if($order){
			$query .= $order . ' ';
		}

		if($limit){
			$query .= $limit . ' ';
			if(!preg_match('/^\\s*SELECT\\s+SQL_CALC_FOUND_ROWS/i', $query))
			{
				$query = preg_replace('/^\\s*SELECT/', 'SELECT SQL_CALC_FOUND_ROWS', $query);
			}
		}

		return array('query'=>$query, 'values'=>$values);
	}

	public static function insert()
	{

	}

	public static function update()
	{

	}

	public static function delete()
	{

	}

	private static function reset()
	{

	}

	private static function parseFields()
	{
		self::$_schema = NULL;
		self::$_table = NULL;
		self::$_fields = NULL;
		self::$_refs = NULL;
		self::$_usedRefs = array();
		self::$_usedFields = array();
	}

	private static function getSchema($schema)
	{
		if(!isset(self::$_schemas[$schema]))
		{
			$path = API_PATH . 'schema/' . $schema . '.php';
			include_once($path);

			$schemaName = '_schema_' . $schema;
			$data = $$schemaName;
			self::$_schemas[$schema] = array('_'=>$data);
		}
		return self::$_schemas[$schema]['_'];
	}

	private static function parseSchema($schemaName, $viewName = NULL)
	{
		if(!$viewName)
		{
			if(preg_match('/^([^\.]+)\.([^\.]+)$/', $schemaName, $match))
			{
				$schemaName = $match[1];
				$viewName = $match[2];
			}
			else
			{
				$viewName = 'default';
			}
		}
		if(isset(self::$_schemas[$schemaName]) && isset(self::$_schemas[$schemaName][$viewName]))
		{
			return self::$_schemas[$schemaName][$viewName];
		}

		$schema = self::getSchema($schemaName);
		if(!$schema)
		{
			throw new Error("Schema `{$schemaName}` was not found.");
		}

		if(!$schema['VIEWS'][$viewName])
		{
			throw new Error("View `{$viewName}` was not found on schema `{$schemaName}`.");
		}

		$view = $schema['VIEWS'][$viewName];

		$refs = $schema['REFS'];
		$fields = array_merge($schema['FIELDS'], $view['fields']);
		$where = $view['where'];
		$order = $view['order'];
		$limit = $view['limit'];

		foreach ($refs as $k=>$v)
		{
			if(!isset(self::$_usedRefs[$k]))
			{
				self::$_usedRefs[$k] = array();
			}

			if(!in_array($v, self::$_usedRefs[$k]))
			{
				self::$_usedRefs[$k][] = $v;
			}
		}

		foreach($fields as $k=>$v)
		{
			if($k == 'id')
			{
				continue;
			}
			if(!isset(self::$_usedFields[$k]))
			{
				self::$_usedFields[$k] = array();
			}
			if(!in_array($schemaName, self::$_usedFields[$k]))
			{
				self::$_usedFields[$k][] = $schemaName;
			}
		}

		$view = array('name'=>$schemaName, 'view'=>$viewName, 'refs'=>$refs, 'fields'=>$fields, 'where'=>$where, 'order'=>$order, 'limit'=>$limit);
		self::$_schemas[$schemaName][$viewName] = $view;
		return $view;
	}

	private static function getField($schemaName, $field = NULL)
	{
		$parts = explode('.', $schemaName);
		if(!is_null($field))
		{
			$parts[] = $field;
		}
		$alias = NULL;
		$ref = NULL;
		$view = 'default';
		$schema = self::$_schema;

		$parts = array_reverse($parts);
		if(isset($parts[0]))
		{
			$field = $parts[0];
		}

		if(count($parts) > 2)
		{
			$view = $parts[1];
			$schema = $parts[2];
		}else if(count($parts) == 2){
			$schema = $parts[1];
		}
		if(preg_match('/^(?:(p|f)k_)(.+)$/', $field, $match))
		{
			if($match[1] == 'p' && $match[2] == self::$_schema)
			{
				$alias = 'id';
				$schema = self::$_schema;
			}else{
				$matchedSchema = $match[2];
				$viewData = self::parseSchema($schema, $view);

				if(isset($viewData['refs'][$matchedSchema]))
				{
					$ref = $viewData['refs'][$matchedSchema];
				}else{
					if(isset(self::$_usedRefs[$matchedSchema]))
					{
						$ref = self::$_usedRefs[$matchedSchema][0];
					}else if(isset(self::$_usedFields[$field]))
					{
						foreach(self::$_usedFields[$field] as $r)
						{
							if(isset(self::$_usedRefs[$r]))
							{
								$ref = self::$_usedRefs[$r][0];
								break;
							}
						}
						
					}
				}
				if($field == 'fk_' . $matchedSchema)
				{
					$field = 'pk_' . $matchedSchema;
				}
				if(!$ref)
				{
					return NULL;
				}
				$schema = $matchedSchema;
				$view = 'default';
				$alias = $matchedSchema . '_id';
				$schema = $matchedSchema;
			}
		}else{

			$viewData = self::parseSchema($schema, $view);
			if(isset($viewData['fields'][$field]))
			{
				
				$fieldValue = $viewData['fields'][$field];
				$alias = $field;
				if(preg_match('/\?$/', $alias))
				{
					$alias = preg_replace('/\?$/', '', $alias);
					$field = $fieldValue;
				}else{
					if(is_null($fieldValue))
					{
						return NULL;
					}
					if(is_bool($fieldValue))
					{
						if($fieldValue === FALSE)
						{
							return NULL;
						}
						if($schema != self::$_schema)
						{
							if(isset(self::$_usedRefs[$schema]))
							{
								$ref = self::$_usedRefs[$schema][0];
							}
						}
					}
					if(is_string($fieldValue))
					{
						if(preg_match('/^[^\.]+.[^\.]+/', $fieldValue))
						{
							$fieldData = self::getField($fieldValue);
							$field = $fieldData['field'];
							$schema = $fieldData['schema'];
							$ref = $fieldData['ref'];
						}
					}
				}
			}
		}
		return array('field'=>$field, 'alias'=>$alias, 'schema'=>$schema, 'ref'=>$ref);
	}

	public static function buildWhereConditions($items, &$values, &$refs)
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
				$where .= '(' . self::buildWhereConditions($v, $values, $joins, FALSE) . ')';
			}else{
				if(empty($match[2]) && $match[3] != '?')
				{
					continue;
				}
				$fieldData = self::getField($match[2]);
				if(isset($fieldData['ref']) && !empty($fieldData['ref']))
				{
					if(!isset($refs[$fieldData['schema']]))
					{
						$refs[$fieldData['schema']] = $fieldData['ref'];
					}
				}
				$name = "`{$fieldData['schema']}`.`{$fieldData['field']}`";
				$value = $v;
				$cond = ' ' . $name;
				if(is_array($value))
				{
					$cond .= ' IN (' . implode(',', array_fill(0, count($value), '?')) . ') ';
					$values = array_merge($values, $value);

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
								$cond = $match[2] . " = " . $value;
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
				}
				$where .= $cond;
			}
		}
		if($where)
		{
			$where = self::clearWhereConditions($where);
		}


		return $where;
	}

	private static function clearWhereConditions($where)
	{
		$where = trim($where);
		$where = trim($where, '&');
		$where = trim($where, '|');
		$where = trim($where);
		$where = preg_replace('/\&\&\&/', 'AND', $where);
		$where = preg_replace('/\|\|\|/', 'OR', $where);
		return $where;
	}

	private static function buildOrderClause($items)
	{
		$orders = array();


		foreach($items as $item)
		{
			$dir = 'ASC';

			preg_match('/^(\??)(\-?)(.*?)$/', $item, $match);
			$value = $match[3];
			if(isset($match[1]) && !empty($match[1]))
			{
				$orders[] = $value;
			}else{

				if(isset($match[2]) && !empty($match[2]))
				{
					$dir = 'DESC';
				}

				if(preg_match("/(RAND\()/", $item))
				{
					$orders[] = $item;
				}else
				{
					$orders[] = '`'.$value.'` ' . $dir;	
				}
			}
			
		}

		if(count($orders) > 0)
		{
			return ' ORDER BY ' . implode(', ', $orders);
		}
		
		return NULL;
	}

	private static function buildLimitClause($items)
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