<?php
namespace core;

class Model
{
    protected static $db;

    public $validation = [];

    public $methodsToValidate = ['insert', 'update'];

    public function __construct()
    {
        self::$db = DB::getInstance();
    }

    public function all()
    {
        return self::$db->fetch_all('SELECT * FROM '.$this->table);
    }

    public function get($id)
    {
        return self::$db->fetch_one('SELECT * FROM '.$this->table.' WHERE id = ?', ['id' => $id]);
    }

    public function insert($data)
    {
        $this->validate('insert');
        return self::$db->insertFields($this->table, $data);
    }

    public function update($id, $data)
    {
        $this->validate('update');
        return self::$db->updateFields($this->table, $data, "id = $id");
    }

    public function delete($id)
    {
        return self::$db->delete($this->table, $id);
    }

    public function getWhere($conditions)
    {
        $where = $this->queryBuilderWhere($conditions);
        return self::$db->fetch_all('SELECT * FROM '.$this->table.$where, $conditions);
    }

    public function isUnique($conditions)
    {
        $get = self::getWhere($conditions);
        if(count($get) >= 1) {
            return false;
        }

        return true;
    }

    private function queryBuilderWhere($conditions)
    {
        $where = '';
        foreach ($conditions as $fieldName => $value) {
            $where .= empty($where) ? " WHERE $fieldName = ?" : " AND $fieldName = ?";
        }
        return $where;
    }

    private function validate($method)
    {
        Validate::current($this, $method);
    }
}