<?php
namespace controller;

class User extends Controller
{
    public function index()
    {
        return $this->template->render('index.html');
    }

    public function authenticate()
    {
        return $this->template->render('login.html');
    }

}