<?php
use core\Controller;

class UserController extends Controller
{
    public function index()
    {
        echo "lista de usuarios";
    }

    public function create()
    {
        echo "crete a user";
    }

    public function delete($id)
    {
        echo "delete $id";
    }

}