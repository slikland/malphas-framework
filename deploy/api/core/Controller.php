<?php
namespace core;
use core\Utils\File;
use core\Route;

class Controller
{
    public $isAuthenticable = true;

    public function view($file, $data = false)
    {
        return new Template($file, $data);
    }

    public static function load($controllerName)
    {
        $file  = !empty(self::find($controllerName)['fileName']) ? self::find($controllerName)['fileName'] : false;
        $class = !empty(self::find($controllerName)['className']) ? self::find($controllerName)['className'] : false;
        $file  = CONTROLLER_PATH . $file;
        $loadedFile = File::load($file);
        $instance = $loadedFile ? new $class : false;

        return $instance;
    }

    public static function find($controllerName = false)
    {
        $ls = File::ls(CONTROLLER_PATH);
        $findController = !empty(self::parseControllerName(false, true)) ? self::parseControllerName(false, true) : false;

        if(!empty($controllerName)) {
            $findController = self::parseControllerName($controllerName, true);
        }
        
        foreach ($ls as $key => $file) {
            $toCompare = mb_strtolower($file);

            if($toCompare == $findController) {
                return [
                    'fileName' => $file,
                    'className' => str_replace('.php', '', $file)
                ];
            }

        }

        return false;
    }

    public static function parseControllerName($controllerName = false, $withExtension = false)
    {
        $name = !empty(Route::getRequestParams()['controller']) ? mb_strtolower(Route::getRequestParams()['controller']) . 'controller' : null;

        if ($controllerName) {
            $name = mb_strtolower($controllerName) . 'controller';
        }

        if($withExtension) {
            $name = $name . '.php';
        }

        return $name;
    }
}