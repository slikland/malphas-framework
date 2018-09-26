<?php
use model\User;
use core\Service;

class UserService extends Service
{
    protected $model;

    public function __construct()
    {
        $this->model = new User();
    }

}