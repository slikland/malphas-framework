<?php
$_schema_cms_setting = array (
  '__schema' => 
  array (
    'columns' => 
    array (
      'name' => 
      array (
        'type' => 'varchar(255)',
        'description' => 'NOT NULL',
      ),
    ),
    'pks' => 
    array (
      0 => 'name',
    ),
    'engine' => 'InnoDB',
    'charset' => 'utf8',
  ),
  'FIELDS' => 
  array (
    'name' => true,
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
        'name' => true,
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