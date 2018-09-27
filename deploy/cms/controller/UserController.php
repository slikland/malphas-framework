<?php
use model\User;
use model\Role;
use core\Controller;
use core\Utils\Filter;
use core\Http;
use core\JsonResponse;

class UserController extends Controller
{
    private $model;

    public function __construct()
    {
        $this->model = new User();
    }

    public function index()
    {
        return $this->view('user/index', array(
            'pageTitle'     => 'Usuário',
            'pageSubTitle'  => 'Todos',
            'users'         => $this->model->all()
        ));
    }

    public function create()
    {
        $role = new Role();
        return $this->view('user/create', array(
            'pageTitle'     => 'Adicionar Usuário',
            'pageSubTitle'  => '',
            'roles'         => $role->all()
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
        $role = new Role();
        return $this->view('user/create', array(
            'pageTitle'     => 'Editar Usuário',
            'pageSubTitle'  => '',
            'user'          => $this->model->get($id),
            'roles'         => $role->all()
        ));
    }

    public function update($id)
    {
        $filteredData = Filter::vetor($this->model->fillable, $_POST);

        if($this->model->update($id, $filteredData)) {
            $return = array(
                'action' => true,
                'message' => 'Usuário editado com sucesso.'
            );
        } else {
            $return = array(
                'action' => false,
                'message' => 'Usuário não editado.'
            );
        }

        Http::contentType('application/json');
        print json_encode($return);
    }

    public function delete($id)
    {
        $this->model->delete($id);
        header("Location: " . BASE_URL . 'user/');
    }
    
}