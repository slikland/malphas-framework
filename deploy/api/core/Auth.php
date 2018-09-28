<?php
namespace core;

use model\User;

class Auth
{
    protected $expire     = 180;
    protected $inactivity = 60;
    protected $redirectTo = 'dashboard';

    public static function login()
    {

    }

}