<?php
namespace core;

class Model
{
    protected $db;

    public $validation = [];

    public $methodsToValidate = ['insert', 'update'];

    public function __construct()
    {
        $this->db = DB::getInstance();
    }

    public static function all($fetchAll = true)
    {
        if(!$fetchAll) {
            return DB::getInstance()->{static::$table}()->where('deleted_at', null);
        }

        return DB::getInstance()->{static::$table}()->where('deleted_at', null)->fetchAll();
    }

    public static function get($id)
    {
        return DB::getInstance()->{static::$table}()->where('deleted_at', null)->where('id', $id)->fetch();
    }

    public static function insert($data)
    {
        self::validate('insert');

        try {
            $data = DB::getInstance()->createRow(static::$table, $data);
            $data->save();
            return true;
        }
        catch(\PDOException $e) {
            return $e->getMessage();
        }
    }

    public static function update($id, $data)
    {
        self::validate('update');

        try {
            self::get($id)->update($data);
            return true;
        }
        catch(\PDOException $e) {
            return $e->getMessage();
        }
    }

    public static function delete($id)
    {
        $data = ['deleted_at' => date('Y-m-d H:i:s')];
        try {
            self::get($id)->update($data);
            return true;
        }
        catch(\PDOException $e) {
            return $e->getMessage();
        }
    }

    private static function validate($method)
    {
//        Validate::current($this, $method);
    }
}