<?php
namespace slikland\db;

class SchemaParser{
	const TYPE_YAML = 'yaml';

	function parseFolder($path, $type = self::TYPE_YAML)
	{
		$files = \slikland\fs\File::listDir($path);
		foreach($files as $file)
		{
			$this->parseYAML($file);
		}
	}

	function loadFile($path, $type = self::TYPE_YAML)
	{

	}

	function parseYAML($file)
	{
		include_once('vendors/Spyc.php');

		$content = file_get_contents($file);
		$data = spyc_load($content);
	}

	public function parseTables()
	{
		$db = db();
		$schemas = array();
		$tables = $db->fetch_all('SHOW TABLES', NULL, TRUE);
		foreach($tables as $table)
		{
			$table = $table[0];
			$create = $db->fetch_one('SHOW CREATE TABLE ' . $table, NULL, TRUE);
			$schemas[$table] = $this->parseCreateSchema($create[1]);
		}
		return $schemas;
	}

	private function parseCreateSchema($schema)
	{
		$data = array();

		if(preg_match_all('/^\s*\`(.*?)\` ([^\s]+) (.*?),?$/m', $schema, $matches, PREG_SET_ORDER))
		{
			$columns = array();
			foreach($matches as $match)
			{
				$columns[$match[1]] = array('type'=>$match[2], 'description'=>$match[3]);
			}
			$data['columns'] = $columns;
		}

		if(preg_match('/^\s*PRIMARY KEY \((.*?)\),?$/m', $schema, $matches))
		{
			preg_match_all('/(`?)([^\s\`\,]*?)\1/', $matches[1], $matches, PREG_SET_ORDER);
			$primaryKeys = array();
			foreach($matches as $match)
			{
				if(strlen(trim($match[2])) > 0)
				{
					$primaryKeys[] = $match[2];
				}
			}
			$data['pks'] = $primaryKeys;
		}

		if(preg_match_all('/^\s*KEY (?:`(.*?)` )?\(\`(.*?)\`\),?$/m', $schema, $matches, PREG_SET_ORDER))
		{
			$keys = array();
			foreach($matches as $match)
			{
				$keys[] = array('name'=>$match[1], 'column'=>$match[2]);
			}
			$data['keys'] = $keys;
		}

		if(preg_match_all('/^\s*CONSTRAINT `(.*?)` FOREIGN KEY \(\`(.*?)\`\) (.*?),?$/m', $schema, $matches, PREG_SET_ORDER))
		{
			$constraints = array();
			foreach($matches as $match)
			{
				$constraints[] = array('name'=>$match[1], 'column'=>$match[2], 'description'=>$match[3]);
			}
			$data['constraints'] = $constraints;
		}

		if(preg_match('/ENGINE=([^\s]+)/', $schema, $match))
		{
			$data['engine'] = $match[1];
		}

		if(preg_match('/DEFAULT CHARSET=([^\s]+)/', $schema, $match))
		{
			$data['charset'] = $match[1];
		}

		return $data;
	}

	function generateCreateSchema($tableName, $data)
	{
		$db = db();
		$create = $db->fetch_one('SHOW CREATE TABLE ' . $tableName, NULL, TRUE);

		print($create[1]);
		print "\n\n";

		$sql = '';
		$sql .= "CREATE TABLE `${tableName}` ";

		$columns = array();
		foreach($data['columns'] as $k=>$v)
		{
			$col = '`' . $k .'`';
			if(isset($v['type']))
			{
				$col .=  ' ' . $v['type'];
			}

			if(isset($v['description']))
			{
				$col .= ' ' . $v['description'];
			}

			$columns[] = $col;
		}

		if(isset($data['pks']))
		{
			$columns[] = 'PRIMARY KEY (`' . implode('`, `', $data['pks']) . '`)';
		}

		if(isset($data['keys']))
		{
			foreach($data['keys'] as $v)
			{
				$columns[] = 'KEY `' . $v['name'] .'` (`'.$v['column'].'`)';
			}
		}

		if(isset($data['constraints']))
		{
			foreach($data['constraints'] as $v)
			{
				$columns[] = 'CONSTRAINT `' . $v['name'] .'` FOREIGN KEY (`'.$v['column'].'`) ' . $v['description'];
			}
		}

		$sql .= "(\n" . implode(", \n", $columns) . "\n) ";

		if(isset($data['engine']))
		{
			$sql .= "ENGINE={$data['engine']} ";
		}

		if(isset($data['charset']))
		{
			$sql .= "DEFAULT CHARSET={$data['charset']} ";
		}

		return $sql;
	}

	function dumpSchema()
	{

	}

	function executeSchema()
	{

	}

}
