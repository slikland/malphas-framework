<?php
namespace core;
use core\Utils\File;

class Controller
{
    public $isAuthenticable = false;

    public $validation = [];

    public $methodsToValidate = ['insert', 'update'];

    public function __construct()
    {
        if($this->isAuthenticable){
           Auth::isLoggedIn();
        }
    }

    public function view($file, $data = false)
    {
        return new Template($file, $data);
    }

    public function redirect($path){
        return Http::redirect($path);
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

    public static function execute($controller, $method, $parameters = false)
    {
        $instance = self::load($controller);
        self::validate($instance, $method);

        if(!method_exists ($instance, $method)) {
            Http::status(404);
            echo "404";
            die();
        }

        if($method && $parameters) {
            $instance->{$method}($parameters);
        } elseif ($method) {
            $instance->{$method}();
        }
    }

    public static function parseControllerName($controllerName = false, $withExtension = false)
    {
        $name = !empty(RouteCms::getRequestCms()['class']) ? mb_strtolower(RouteCms::getRequestCms()['class']) . 'controller' : null;

        if ($controllerName) {
            $name = mb_strtolower($controllerName) . 'controller';
        }

        if($withExtension) {
            $name = $name . '.php';
        }

        return $name;
    }

    protected static function parseResponse($response)
    {
        if($response === true) {
            return true;
        }

        $response = [
            'error' => true,
            'message' => $response
        ];

        return $response;
    }

    private static function validate($instance, $method)
    {
        Validate::current($instance, $method);
    }
}