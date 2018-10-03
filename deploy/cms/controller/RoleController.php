<?php
use model\Role;
use core\Controller;
use core\Utils\Filter;
use core\JsonResponse;

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
        return $this->view('role/create', array(
            'pageTitle'     => 'Adicionar Grupo Usuário',
            'pageSubTitle'  => ''
        ));
    }

    public function insert()
    {
        $filteredData = Filter::vetor($this->model->fillable, $_POST);
        $insert = $this->model->insert($filteredData);
        $response = parent::parseResponse($insert);

        return JsonResponse::set(200, $response);
    }

    public function edit($id)
    {
        return $this->view('role/create', array(
            'pageTitle'     => 'Editar Grupo Usuário',
            'pageSubTitle'  => '',
            'role'         => $this->model->get($id)
        ));
    }

    public function update($id)
    {
        $filteredData = Filter::vetor($this->model->fillable, $_POST);
        $update = $this->model->update($id, $filteredData);
        $response = parent::parseResponse($update);

        return JsonResponse::set(200, $response);
    }

    public function delete($id)
    {
        $delete = $this->model->delete($id);
        $response = parent::parseResponse($delete);

        return JsonResponse::set(200, $response);
    }
}