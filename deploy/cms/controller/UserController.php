<?php
use model\User;
use core\Controller;

class UserController extends Controller
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

    public function create()
    {
        echo "show a form to crete a user";
    }

    public function insert()
    {
        echo json_encode($this->model->insert($_POST));
    }

    public function edit($id)
    {
        echo "show a form to edit a user";
    }

    public function update($id)
    {
        echo json_encode($this->model->update($id, $_POST));
    }

    public function delete($id)
    {
        echo json_encode($this->model->delete($id));
    }

    public function get($id)
    {
        echo json_encode($this->model->get($id));
    }
    
}