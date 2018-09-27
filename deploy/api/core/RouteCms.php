<?php
namespace core;

class RouteCms extends Route
{
    public static function add($route, $action)
    {
        parent::addExplicitRoute($route);

        if(parent::getRequestUri() == $route) {
            if ($action instanceof \Closure) {
                return $action();
            } else {
                self::parseAndExecute($action);
            }
            die();
        }
    }

    public static function run()
    {
        $request    = self::getRequestCms();
        $controller = !empty($request['class']) ? $request['class'] : false;
        $method     = !empty($request['method']) ? $request['method'] : false;
        $parameters = !empty($request['parameters']) ? $request['parameters'] : false;

        return Controller::execute($controller, $method, $parameters);
    }

    public static function getRequestCms()
    {
        $request = parent::getRequestUri();
        $explode = explode('/', $request);
        $response = [];

        foreach ($explode as $key => $item) {
            if($key == 0 && !empty($item)) {
                $response['class'] = $item;
            } elseif($key == 1) {
                if(!empty($response['class'])) {
                    $response['method'] = !empty($item) ? $item : 'index';
                }
            } elseif(!empty($item)) {
                $response['parameters'][] = $item;
            }
        }

        return parent::sanitizeParams($response);
    }

    private static function parseAndExecute($controllerAtMethod)
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