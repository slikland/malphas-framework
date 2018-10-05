<?php
namespace core;

class JsonResponse
{
    public static function set($status, $data = false)
    {
        Http::status($status);
        Http::contentType('application/json');

        if(!$data) {
            $data = Http::statusMessage($status);
        }

        print json_encode($data);
        die;
    }
}