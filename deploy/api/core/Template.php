<?php
namespace core;

class Template
{
    public function __construct($path, $data)
    {
        $fileName = self::viewFileName($path);
        $fullPath = VIEWS_PATH . $fileName;

        foreach ($data as $name => $value)
        {
            $$name = $value;
        }

        require_once $fullPath;
    }

    private static function viewFileName($path)
    {
        if(preg_match('/\.php/', $path, $matches))
        {
            return $path;
        }

        return $path . '.php';
    }

}