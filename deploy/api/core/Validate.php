<?php
namespace core;

class Validate
{
    public static $messages = [];
    public static $validation = [];

    public static function this($instance, $method)
    {
        if(!in_array($method, $instance->methodsToValidate)) {
            return true;
        }
        
        self::setValidation($instance->validation, $method);
        self::execute();
        die('im die in Validate.php:17');

        if(!empty(self::$messages)) {
            Http::contentType('application/json');
            print json_encode(self::$messages);
            exit;
        }
    }


    public static function setValidation($validation, $method)
    {
        if(empty($validation['general'])) {
            throw new \Exception('general key is missing in array to validate');
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

    private static function doSomething($field, $validation)
    {
        foreach ($validation as $class => $method) {
            if(!is_array($method)) {
                self::setMessages($field, $class::$method($post[$field]));
            } else {

                foreach ($method as $methodOrParams) {
                    if(is_array($methodOrParams)){

                        foreach ($methodOrParams as $method => $param){
                            self::setMessages($field, $class::$method($post[$field], $param));
                        }

                    } else {
                        self::setMessages($field, $class::$methodOrParams($post[$field]));
                    }
                }

            }
        }
    }

    private static function execute()
    {
        foreach(self::$validation as $field => $validation):
            self::doSomething($field, $validation);
        endforeach;
    }
}