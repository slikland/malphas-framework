<?php
namespace core;

class Route
{
    public static $explicitRoute = [];

    protected static function addExplicitRoute($route)
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

}