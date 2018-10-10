<?php
namespace model;

use core\Model;

class User extends Model
{
    protected static $table = 'cms_users';

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

    public static $fillable = [
        'name',
        'email',
        'password',
        'cms_role_id'
    ];

    public static function getByEmail($email)
    {
        return User::all(false)->where('email', $email);
    }
}