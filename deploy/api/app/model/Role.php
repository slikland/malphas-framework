<?php

namespace model;

use core\Model;

class Role extends Model
{
    protected static $table = 'cms_roles';

    public $fillable = [ 'name' ];

    public $validation = [
        'name' => [
            'Data' => [
                'required',
                ['min' => 3],
                ['max' => 255]
            ]
        ]
    ];

}