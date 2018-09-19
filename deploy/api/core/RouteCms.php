<?php
namespace core;

use core\Utils\File;

class RouteCms extends Route
{
    public static function run()
    {
        $file = self::findController();
        $request = parent::getRequestParams();

        if(!$file) {
            throw new \Exception('Controller not Found');
        }

        $fileName = $file['fileName'];
        require_once CONTROLLER_PATH . $fileName;
        $instance   = new $file['className'];
        $method     = !empty($request['method']) ? $request['method'] : false;
        $parameters = !empty($request['parameters']) ? $request['parameters'] : false;

        if($method && $parameters) {
            $instance->{$method}($parameters);
        } elseif ($method) {
            $instance->{$method}();
        }

    }

    public static function findController()
    {
        $ls = File::ls(CONTROLLER_PATH);
        $findController = !empty(self::nameController()) ? self::nameController() . '.php' : false;

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

    public static function nameController()
    {
        return !empty(parent::getRequestParams()['controller']) ? mb_strtolower(parent::getRequestParams()['controller']) . 'controller' : null;
    }
}