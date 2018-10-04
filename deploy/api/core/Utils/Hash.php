<?php
namespace core\Utils;


class Hash
{
    public static function generate($text)
    {
        return password_hash($text,PASSWORD_DEFAULT);
    }

    public static function verify($text, $hash)
    {
        if (password_verify($text, $hash)) {
            return true;
        }

        return false;
    }
}