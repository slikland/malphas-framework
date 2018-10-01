<?php
namespace core\Utils;


class Type
{
    public static function isInt($value)
    {
        $strlen = strlen($value);
        $value = preg_replace('/\D/', '', $value);
        $parseInt = (int) $value;

        if($parseInt > 0 && $strlen == strlen($parseInt)) {
            return true;
        }

        return false;
    }
}