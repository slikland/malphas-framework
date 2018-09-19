<?php
use core\Controller;

class UserController extends Controller
{
    public function create()
    {
        return $this->view('auth/login', ['name' => 'Sliklander']);
    }

    public function delete($id)
    {
        echo "delete $id";
    }

}