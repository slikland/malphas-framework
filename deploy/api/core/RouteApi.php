<?php
namespace core;

class RouteApi extends Route
{
    public static function run()
    {
        $request    = parent::getRequestParams();
        $service    = !empty($request['class']) ? $request['class'] : false;
        $method     = !empty($request['method']) ? $request['method'] : false;
        $parameters = !empty($request['parameters']) ? $request['parameters'] : false;

        return parent::executeService($service, $method, $parameters);
    }
}