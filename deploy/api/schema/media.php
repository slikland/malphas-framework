<?php
$_schema_media = array (
  '__schema' => 
  array (
    'columns' => 
    array (
      'pk_media' => 
      array (
        'type' => 'int(11)',
        'description' => 'NOT NULL AUTO_INCREMENT',
      ),
      'name' => 
      array (
        'type' => 'varchar(255)',
        'description' => 'DEFAULT NULL',
      ),
      'ext' => 
      array (
        'type' => 'varchar(10)',
        'description' => 'DEFAULT NULL',
      ),
      'path' => 
      array (
        'type' => 'varchar(255)',
        'description' => 'DEFAULT NULL',
      ),
    ),
    'pks' => 
    array (
      0 => 'pk_media',
    ),
    'engine' => 'InnoDB',
    'charset' => 'utf8',
  ),
  'FIELDS' => 
  array (
    'id' => 'pk_media',
    'pk_media' => false,
    'name' => true,
    'ext' => true,
    'path' => true,
  ),
  'REFS' => 
  array (
  ),
  'VIEWS' => 
  array (
    'default' => 
    array (
      'fields' => 
      array (
        'id' => 'pk_media',
        'name' => true,
        'ext' => true,
        'path' => true,
      ),
      'where' => 
      array (
      ),
      'order' => 
      array (
      ),
      'limit' => 
      array (
      ),
    ),
  ),
);