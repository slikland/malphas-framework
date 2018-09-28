<?php

class Email
{
    public static function isValid($data)
    {
        $isValid = filter_var($data, FILTER_VALIDATE_EMAIL) ? true : false;

        if($isValid) {
            return true;
        }

        return ['message' => 'Email não é válido'];
    }

}