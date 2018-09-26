<?php
namespace core;

class RouteCms extends Route
{
    public static function run()
    {
        $request    = parent::getRequestParams();
        $controller = !empty($request['class']) ? $request['class'] : false;
        $method     = !empty($request['method']) ? $request['method'] : false;
        $parameters = !empty($request['parameters']) ? $request['parameters'] : false;

        return parent::executeController($controller, $method, $parameters);
    }
}