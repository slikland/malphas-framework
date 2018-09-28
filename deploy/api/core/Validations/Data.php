<?php

class Data
{
    public static function required($postValue)
    {
        if(!empty($postValue)) {
            return true;
        }
        return ['message' => 'Campo não está preenchido'];
    }

    public static function min($postValue, $valid)
    {
        $isValid = (strlen($postValue) >= $valid);
        if($isValid){
            return true;
        }

        return ['message' => "Preencha $valid caracteres ou mais"];
    }

    public static function max($postValue, $valid)
    {
        $isValid = (strlen($postValue) <= $valid);
        if($isValid) {
            return true;
        }

        return ['message' => "Digite no máximo {$valid} caracteres"];
    }

    public static function unique($postValue)
    {
        return true;
    }

}