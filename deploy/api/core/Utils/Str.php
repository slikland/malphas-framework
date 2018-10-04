<?php

namespace core\Utils;

class Str
{
    public static function slugfy($string)
    {
        $slugfy = preg_replace(['/([`^~\'"])/', '/([-]{2,}|[-+]+|[\s]+)/', '/(,-)/'], [null, '-', '-'], iconv( 'UTF-8', 'ASCII//TRANSLIT', $string ) );
        $slugfy = trim($slugfy, '-');
        return strtolower($slugfy);
    }



}