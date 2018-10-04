<?php
use core\Utils\Type;
use core\Http;

class Data
{
    public static function required($postValue)
    {
        if(!empty($postValue)) {
            return true;
        }
        return ['message' => 'Preencha esse campo'];
    }

    public static function min($postValue, $valid)
    {
        if(strlen($postValue) >= $valid){
            return true;
        }

        return ['message' => "Preencha $valid caracteres ou mais"];
    }

    public static function max($postValue, $valid)
    {
        if(strlen($postValue) <= $valid) {
            return true;
        }

        return ['message' => "Digite no máximo {$valid} caracteres"];
    }

    public static function unique($postValue)
    {
        return true;
    }

    public static function isInt($postValue)
    {
        if(Type::isInt($postValue)) {
            return true;
        }

        return ['message' => "Esse campo deve ser do tipo inteiro"];
    }

    public static function equals($postValue, $valid)
    {
        if(Http::getPost($valid) === $postValue) {
            return true;
        }

        return ['message' => "As senhas não conferem"];
    }

}