<?php
namespace controller;
use Twig_Loader_Filesystem;
use Twig_Environment;

class Template
{
    public $template;

    public function __construct()
    {
        $loader = new Twig_Loader_Filesystem(VIEW_PATH);
        $this->template = new Twig_Environment($loader, [
            'cache' => VIEWS_CACHE_PATH,
        ]);
    }
}