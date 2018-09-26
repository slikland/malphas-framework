<?php
use model\Role;
use core\Controller;
use core\Utils\Filter;

class RoleController extends Controller
{
    private $model;

    public function __construct()
    {
        $this->model = new Role();
    }

    public function index()
    {
        return $this->view('role/index', array(
            'pageTitle'     => 'Permissões',
            'pageSubTitle'  => 'Usuários',
            'roles'         => $this->model->all()
        ));
    }

    public function create()
    {

    }

    public function insert()
    {
        $filteredData = Filter::vetor($this->model->fillable, $_POST);

        print json_encode($this->model->insert($filteredData));
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