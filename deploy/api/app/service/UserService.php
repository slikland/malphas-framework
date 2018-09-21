<?php
use model\User;
use core\Service;

class UserService extends Service
{
    private $model;

    public function __construct()
    {
        $this->model = new User();
    }

    public function index()
    {
        echo json_encode($this->model->all());
    }
}