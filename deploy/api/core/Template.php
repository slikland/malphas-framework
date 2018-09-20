<?php
namespace core;

class Template
{
    public function __construct($path, $data)
    {
        $fileName = $this->viewFileName($path);
        $fullPath = VIEWS_PATH . $fileName;
        $data = is_array($data) ? $data : [];

        foreach ($data as $name => $value)
        {
            $$name = $value;
        }

        $this->loadHelpers();
        require_once $fullPath;
    }

    private function loadHelpers()
    {
        require_once VIEWS_PATH . 'helpers.php';
    }

    private function viewFileName($path)
    {
        if(preg_match('/\.php/', $path, $matches))
        {
            return $path;
        }

        return $path . '.php';
    }

}