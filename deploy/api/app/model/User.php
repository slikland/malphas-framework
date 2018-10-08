<?php
namespace model;

use core\Model;

class User extends Model
{
    protected $table = 'cms_users';

    public $validation = [
        'general' => [
            'email' => [
                'Data'  => 'unique'
            ],
            'cms_role_id' => [
                'Data' => 'isInt'
            ]
        ],
        'update' => [
            'email' => []
        ]
    ];

    public $fillable = [
        'name',
        'email',
        'password',
        'cms_role_id'
    ];

    public function getByEmail($email)
    {
        $all = $this->getWhere(['email' => $email]);

        if(count($all) > 1) {
            return $all;
        }

        if(!empty($all[0])) {
            return $all[0];
        }

        return $all;
    }

}