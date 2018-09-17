<?php

class Autoload
{

    public function load($namespaces)
    {
        if(!empty($namespaces)){
            $this->loadPSR4($namespaces);
        }
    }
    
    public function loadFiles($files){
        foreach($files as $file){
            $fullpath = $this->dir."/".$file;
            if(file_exists($fullpath)){
                include_once($fullpath);
            }
        }
    }

    public function loadPSR4($namespaces)
    {
        $this->loadPSR($namespaces, true);
    }

    public function loadPSR($namespaces)
    {
        foreach ($namespaces as $namespace) {

            $ls = $this->lsFiles($namespace);

            foreach ($ls as $item) {
                $fullpath = $namespace . $item;
                if (is_file($fullpath)) {
                    include_once $fullpath;
                }
            }

        }
    }

    protected function lsFiles($dir, $showHiddenFiles = false)
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
