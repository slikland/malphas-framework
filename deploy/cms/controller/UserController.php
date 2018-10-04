<?php
use model\User;
use model\Role;
use core\Controller;
use core\Utils\Filter;
use core\JsonResponse;
use core\Utils\Hash;


class UserController extends Controller
{
    private $model;

    public $validation = [
        'password_confirm' => ['Data'  => 'required'],
        'password' => [
            'Data'  => [
                'required',
                ['equals' => 'password_confirm']
            ]
        ]
    ];

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
        $filteredData['password'] = Hash::generate($filteredData['password']);
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