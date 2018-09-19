<?php
namespace core;

class Route
{
    public static $validRoutes = [];

    public static function get($route, $action)
    {
        self::addValidRoutes($route);

        if(self::getRequestUri() == $route) {
            return $action();
        }
    }

    private static function addValidRoutes($route)
    {
        self::$validRoutes[] = $route;
    }

    private static function getRequestUri()
    {
        $uri = $_SERVER['REQUEST_URI'];

        if(ENV == 'local') {
            $uri = preg_replace('/.*deploy\/cms\//', '', $uri);
            if($uri == "") { $uri = "/"; }
        }

        return $uri;
    }

    protected static function getRequestParams()
    {
        $request = self::getRequestUri();
        $explode = explode('/', $request);
        $response = [];

        foreach ($explode as $key => $item) {
            if($key == 0 && !empty($item)) {
                $response['controller'] = $item;
            } elseif($key == 1) {
                $response['method'] = !empty($item) ? $item : 'index';
            } elseif(!empty($item)) {
                $response['parameters'][] = $item;
            }
        }

        return self::sanitizeParams($response);
    }

    protected static function sanitizeParams($ControllerMethodParams = [])
    {
        $response = $ControllerMethodParams;

        $response['method'] = empty($response['method']) ? 'index' : $response['method'];

        if(!empty($response['parameters'])) {
            $qtdParams = count($response['parameters']);
            $response['parameters'] = ($qtdParams == 1) ? $response['parameters'][0] : $response['parameters'];

        }

        return $response;
    }

}