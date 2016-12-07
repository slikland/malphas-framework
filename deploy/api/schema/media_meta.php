<?php
$_schema_media_meta = array (
  '__schema' => 
  array (
    'columns' => 
    array (
      'pk_media_meta' => 
      array (
        'type' => 'int(11)',
        'description' => 'NOT NULL AUTO_INCREMENT',
      ),
      'title' => 
      array (
        'type' => 'varchar(255)',
        'description' => 'DEFAULT NULL',
      ),
    ),
    'pks' => 
    array (
      0 => 'pk_media_meta',
    ),
    'engine' => 'InnoDB',
    'charset' => 'utf8',
  ),
  'FIELDS' => 
  array (
    'id' => 'pk_media_meta',
    'pk_media_meta' => false,
    'title' => true,
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
        'id' => 'pk_media_meta',
        'title' => true,
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