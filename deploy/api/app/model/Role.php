<?php

namespace model;

use core\Model;

class Role extends Model
{
    protected $table = 'cms_roles';

    public $fillable = [ 'name' ];

}