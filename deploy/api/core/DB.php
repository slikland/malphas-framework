<?php
namespace core;

use LessQL\Database as ORM;

class DB
{
    private static $instance = NULL;

    public static function getInstance($host = NULL, $user = NULL, $pass = NULL, $name = NULL, $port = NULL){
        if(!self::$instance)
        {
            self::$instance = DB::connect($host, $user, $pass, $name, $port);
        }
        return self::$instance;
    }

    private static function connect($host = NULL, $user = NULL, $pass = NULL, $name = NULL, $port = NULL)
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

        if(is_null($port) && defined('DB_PORT'))
        {
            $port = DB_PORT;
        }

        $pdo = new \PDO("mysql:host={$host};dbname={$name}", $user, $pass);
        return new ORM($pdo);
    }
}