<?php
use model\User;
use model\Role;
use core\Controller;
use core\Utils\Filter;
use core\JsonResponse;
use core\Utils\Hash;


class UserController extends Controller
{
    public $validation = [
        'general' => [
            'name' => [
                'Data' => [
                    'required',
                    ['min' => 3]
                ]
            ],
            'email' => [
                'Data' => 'required',
                'Email' => 'isValid'
            ],
            'cms_role_id' => [
                'Data' => 'required'
            ],
            'password_confirm' => ['Data'  => 'required'],
            'password' => [
                'Data'  => [
                    'required',
                    ['equals' => 'password_confirm']
                ]
            ]
        ],
        'update' => [
            'password' => [],
            'password_confirm' => []
        ]
    ];

    public function index()
    {
        return $this->view('user/index', array(
            'pageTitle'     => 'Usuário',
            'pageSubTitle'  => 'Todos',
            'users'         => User::all()
        ));
    }

    public function create()
    {
        return $this->view('user/create', array(
            'pageTitle'     => 'Adicionar Usuário',
            'pageSubTitle'  => '',
            'roles'         => Role::all()
        ));
    }

    public function insert()
    {
        $filteredData = Filter::vetor(User::$fillable, $_POST);
        $filteredData['password'] = Hash::generate($filteredData['password']);
        $insert = User::insert($filteredData);
        $response = parent::parseResponse($insert);

        return JsonResponse::set(200, $response);
    }

    public function edit($id)
    {
        return $this->view('user/create', array(
            'pageTitle'     => 'Editar Usuário',
            'pageSubTitle'  => '',
            'user'          => User::get($id),
            'roles'         => Role::all()
        ));
    }

    public function update($id)
    {
        $filteredData = Filter::vetor(User::$fillable, $_POST);
        $update = User::update($id, $filteredData);
        $response = parent::parseResponse($update);

        return JsonResponse::set(200, $response);
    }

    public function delete($id)
    {
        $delete = User::delete($id);
        $response = parent::parseResponse($delete);

        return JsonResponse::set(200, $response);
    }
}