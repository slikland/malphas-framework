<?php
use core\Controller;

class AuthController extends Controller
{
    public $isAuthenticable = false;

    public function login()
    {
        return $this->view('auth/login');
    }
}