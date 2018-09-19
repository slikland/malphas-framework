<?php
namespace core;

class Controller
{
    public function view($file, $data = false)
    {
        return new Template($file, $data);
    }
}