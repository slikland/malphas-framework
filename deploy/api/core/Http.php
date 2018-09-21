<?php
namespace core;

class Http
{
    public static function ua()
    {
        return filter_input( INPUT_SERVER, 'HTTP_USER_AGENT' );
    }

    public static function method()
    {
        return filter_input( INPUT_SERVER, 'REQUEST_METHOD' );
    }

    public static function isPost()
    {
        if(self::method() === 'POST') {
            return true;
        }

        return false;
    }

    public static function isGet()
    {
        if(self::method() === 'GET') {
            return true;
        }

        return false;
    }

    public static function isPut()
    {
        if(self::method() === 'PUT') {
            return true;
        }

        return false;
    }

    public static function isDelete()
    {
        if(self::method() === 'DELETE') {
            return true;
        }

        return false;
    }
}