<?php
use model\Role;
use core\Controller;
use core\Utils\Filter;
use core\Http;

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

        if($this->model->insert($filteredData)) {
            $return = array(
                'action' => true,
                'message' => 'Grupo Usuário adicionado com sucesso.'
            );
        } else {
            $return = array(
                'action' => false,
                'message' => 'Grupo Usuário não adicionado'
            );
        }

        Http::contentType('application/json');
        print json_encode($return);

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
        if($this->model->update($id, $filteredData)) {
            $return = array(
                'action' => true,
                'message' => 'Grupo Usuário editado com sucesso.'
            );
        } else {
            $return = array(
                'action' => false,
                'message' => 'Grupo Usuário não editado.'
            );
        }

        Http::contentType('application/json');
        print json_encode($return);
    }

    public function delete($id)
    {
        if($this->model->delete($id)) {
            $return = array(
                'action' => true,
                'message' => 'Grupo Usuário deletado com sucesso.'
            );
        } else {
            $return = array(
                'action' => false,
                'message' => 'Grupo Usuário não deletado.'
            );
        }

        Http::contentType('application/json');
        print json_encode($return);
    }

    public function get($id)
    {
        echo json_encode($this->model->get($id));
    }
    
}