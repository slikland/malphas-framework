<?php
namespace core;

class Model
{
    protected static $db;

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
        return self::$db->insertFields($this->table, $data);
    }

    public function update($id, $data)
    {
        return self::$db->updateFields($this->table, $data, "id = $id");
    }

    public function delete($id)
    {
        return self::$db->delete($this->table, $id);
    }
}