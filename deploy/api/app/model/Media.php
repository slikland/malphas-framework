<?php

namespace model;

use core\Model;

class Media extends Model
{
    protected $table = 'medias';

    public $fillable = [
        'name',
        'ext',
        'description',
        'type',
        'size',
    ];

}