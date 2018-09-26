<?php
namespace model;

use core\Model;

class User extends Model
{
    protected $table = 'cms_users';

    public $fillable = [
        'name',
        'email',
        'password',
        'cms_role_id'
    ];

}