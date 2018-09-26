<?php
namespace core;

class RouteCms extends Route
{
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
                $response['method'] = !empty($item) ? $item : 'index';
            } elseif(!empty($item)) {
                $response['parameters'][] = $item;
            }
        }

        return self::sanitizeParams($response);
    }
}