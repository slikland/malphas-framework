<?php
namespace core;

class Service
{
    public $isAuthenticable = true;

    public static function load($controllerName)
    {
        $file  = !empty(self::find($controllerName)['fileName']) ? self::find($controllerName)['fileName'] : false;
        $class = !empty(self::find($controllerName)['className']) ? self::find($controllerName)['className'] : false;
        $file  = CONTROLLER_PATH . $file;
        $loadedFile = File::load($file);
        $instance = $loadedFile ? new $class : false;

        return $instance;
    }

}