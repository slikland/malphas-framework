<?php
use core\Controller;

class AuthController extends Controller
{
    public $isAuthenticable = false;

    public function login()
    {
        return $this->view('auth/login');
    }

    public function forgotpassword()
    {
        return $this->view('auth/forgot-password');
    }
}