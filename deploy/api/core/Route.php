<?php
namespace core;

class Route
{
    public static $explicitRoute = [];

    public static function add($route, $action)
    {
        self::addExplicitRoute($route);

        if(self::getRequestUri() == $route) {
            if ($action instanceof \Closure) {
                return $action();
            } else {
                self::parseAndExecute($action);
            }
            die();
        }
    }

    private static function addExplicitRoute($route)
    {
        self::$explicitRoute[] = $route;
    }

    public static function getRequestUri()
    {
        $uri = $_SERVER['REQUEST_URI'];
        
        if(ENV == 'local') {
            $uri = preg_replace('/.*deploy\/'.MANAGEMENT_NAME.'\//', '', $uri);
            $uri = preg_replace('/.*deploy\/'.SERVICES_NAME.'\//', '', $uri);
            if($uri == "") { $uri = "/"; }
        }

        return $uri;
    }

    protected static function sanitizeParams($methodParams = [])
    {
        $response = $methodParams;

        if(!empty($response['class'])) {
            $response['method'] = !empty($response['method']) ? $response['method'] : 'index';
        }

        if(!empty($response['parameters'])) {
            $qtdParams = count($response['parameters']);
            $response['parameters'] = ($qtdParams == 1) ? $response['parameters'][0] : $response['parameters'];

        }

        return $response;
    }

    protected static function isExplicitRoute($route = false)
    {
        $lookingFor = self::getRequestUri();

        if($route) {
            $lookingFor = $route;
        }

        return in_array($lookingFor, self::$explicitRoute);
    }

    protected static function parseAndExecute($controllerAtMethod)
    {
        $explode = explode('@', $controllerAtMethod);

        if(count($explode) < 2) {
            throw new \Exception('Declaration isnt valid. Declare controller@method');
        }

        $controller = !empty($explode[0]) ? $explode[0] : false;
        $method = !empty($explode[1]) ? $explode[1] : false;

        return Controller::execute($controller, $method);
    }
}