<?php
namespace controller;

class Controller
{
    public $template;

    public function __construct()
    {
        $twig = new Template;
        $this->template = $twig->template;
    }
}