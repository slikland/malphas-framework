<?php
namespace model;

use core\Model;

class User extends Model
{
    protected $table = 'cms_users';

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