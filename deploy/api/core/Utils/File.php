<?php
namespace core\Utils;

class File
{
    public static function create($path, $content, $overwrite)
    {

    }

    public static function copy($from, $to)
    {

    }

    public static function move($from, $to)
    {

    }

    public static function delete($file)
    {

    }

    public static function mkdir($path)
    {

    }

    public static function ls($dir, $showHiddenFiles = false)
    {
        $ls = scandir($dir);
        $remove = [
            '.', '..', '.DS_Store'
        ];

        if(!$showHiddenFiles) {
            return array_diff($ls, $remove);
        }

        return $ls;
    }
}