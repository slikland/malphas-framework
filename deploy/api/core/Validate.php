<?php
namespace core;


class Validate
{
    public static $messages = [];

    public static function this($instance)
    {
        if(!Http::isPost()) {
            return true;
        }

        $post = Http::getPost();
        foreach($instance->validation as $field => $validation) {

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

        if(!empty(self::$messages)) {
            Http::contentType('application/json');
            print json_encode(self::$messages);
            exit;
        }
    }

    private static function setMessages($fieldName, $message)
    {
        if(!empty($message['message'])) {
            self::$messages[$fieldName][] = $message['message'];
        }
    }

}