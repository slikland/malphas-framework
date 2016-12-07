<?php
$_schema_cms_role = array (
  '__schema' => 
  array (
    'columns' => 
    array (
      'pk_cms_role' => 
      array (
        'type' => 'int(11)',
        'description' => 'NOT NULL AUTO_INCREMENT',
      ),
      'name' => 
      array (
        'type' => 'varchar(255)',
        'description' => 'NOT NULL',
      ),
      'created' => 
      array (
        'type' => 'datetime',
        'description' => 'DEFAULT CURRENT_TIMESTAMP',
      ),
    ),
    'pks' => 
    array (
      0 => 'pk_cms_role',
    ),
    'engine' => 'InnoDB',
    'charset' => 'utf8',
  ),
  'FIELDS' => 
  array (
    'id' => 'pk_cms_role',
    'pk_cms_role' => false,
    'name' => true,
    'created' => true,
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
        'id' => 'pk_cms_role',
        'name' => true,
        'created' => true,
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