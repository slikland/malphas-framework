<?php
namespace core;

class RouteApi extends Route
{
    public static function run()
    {
        $request    = self::getRequestApi();
        $service    = !empty($request['class']) ? $request['class'] : false;
        $method     = !empty($request['method']) ? $request['method'] : false;
        $parameters = !empty($request['parameters']) ? $request['parameters'] : false;

        return Service::execute($service, $method, $parameters);
    }

    public static function getRequestApi()
    {
        $request = parent::getRequestUri();
        $explode = explode('/', $request);
        $response = [];

        foreach ($explode as $key => $item) {
            if($key == 0 && !empty($item)) {
                $response['class'] = $item;
            } elseif(!empty($item)) {
                $response['parameters'][] = $item;
            }
        }

        if(!empty($response['class'])) {
            $response['method'] = self::chooseApiMethod($response);
        }

        return parent::sanitizeParams($response);
    }

    private static function chooseApiMethod($request)
    {
        $method = false;
        $requestMethod = Http::method();
        $hasParameters = !empty($request['parameters']);

        if($requestMethod == 'GET' && $hasParameters === false) {
            $method = 'index';
        } elseif ($requestMethod == 'POST' && $hasParameters === false) {
            $method = 'create';
        } elseif ($requestMethod == 'GET' && $hasParameters === true) {
            $method = 'read';
        } elseif ($requestMethod == 'POST' && $hasParameters === true) {
            $method = 'update';
        } elseif ($requestMethod == 'DELETE' && $hasParameters === true) {
            $method = 'delete';
        }

        return $method;
    }
}