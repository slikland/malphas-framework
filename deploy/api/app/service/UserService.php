<?php
use model\User;
use core\Service;

class UserService extends Service
{
    protected $model;

    public $validation = [
        'name' => [
            'Data' => [
                'required',
                ['min' => 3],
                ['max' => 255]
            ]
        ],
        'email' => [
            'Email' => 'isValid',
            'Data'  => [
                'required',
                ['min' => 3],
                'unique'
            ]
        ],
        'password' => [
            'Data'  => [
                'required',
                ['min' => 6]
            ]
        ],
        'cms_role_id' => [
            'Data' => [
                'required',
                'isInt'
            ]
        ]
    ];

    public function __construct()
    {
        $this->model = new User();
    }

}