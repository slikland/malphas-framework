<?php
namespace core;

class Validate
{
    public static $messages = [];
    public static $validation = [];

    public static function current($instance, $method)
    {
        if(!in_array($method, $instance->methodsToValidate)) {
            return true;
        }
        
        self::setValidation($instance->validation, $method);
        self::init();

        if(!empty(self::$messages)) {
            Http::contentType('application/json');
            print json_encode(self::$messages);
            exit;
        }
    }

    public static function setValidation($validation, $method)
    {
        if(empty($validation['general'])) {
            return self::$validation = $validation;
        }

        $validation = self::parseValidation($validation, $method);

        return self::$validation = $validation;
    }

    private static function setMessages($fieldName, $message)
    {
        if(!empty($message['message'])) {
            self::$messages[$fieldName][] = $message['message'];
        }
    }

    private static function parseValidation($validation, $method)
    {
        if(!empty($validation[$method])) {
            foreach ($validation[$method] as $field => $validations) {
                $validation['general'][$field] = $validations;
            }
        }

        return $validation['general'];
    }

    private static function init()
    {
        foreach(self::$validation as $field => $validation):
            foreach ($validation as $class => $params):
                $type = self::classify($class, $params);

                if($type == 'collection') {
                    self::executeCollection($field, $class, $params);
                } elseif ($type == 'methodParam') {
                    self::executeCollection($field, $class, $params);
                } elseif ($type == 'method') {
                    self::execute($field, $class, $params);
                }
                
            endforeach;
        endforeach;
    }

    private static function classify($class, $params)
    {
        if(count($params) > 1) {
            return 'collection';
        }

        if(is_array($params)) {
            foreach ($params as $method => $param) {
                if(method_exists(new $class, $method)) {
                    return 'methodParam';
                }
            }

        }

        if(method_exists(new $class, $params)) {
            return 'method';
        }

        return null;
    }

    private static function executeCollection($field, $class, $params)
    {
        foreach ($params as $list) {
            $type = self::classify($class, $list);
            if($type == 'methodParam') {
                self::executeMethodParam($field, $class, $list);
            } elseif($type == 'method') {
                self::execute($field, $class, $list);
            }
        }
    }

    private static function executeMethodParam($field, $class, $array) {
        foreach ($array as $method => $value) {
            self::execute($field, $class, $method, $value);
        }
    }

    private static function execute($field, $class, $method, $parameter = false)
    {
        $post = Http::getPost();

        if(!$parameter) {
            return self::setMessages($field, $class::$method(@$post[$field]));
        }
        return self::setMessages($field, $class::$method(@$post[$field], $parameter));
    }
}