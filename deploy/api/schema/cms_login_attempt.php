<?php
$_schema_cms_login_attempt = array (
  '__schema' => 
  array (
    'columns' => 
    array (
      'pk_cms_login_attempt' => 
      array (
        'type' => 'int(11)',
        'description' => 'NOT NULL AUTO_INCREMENT',
      ),
      'ip' => 
      array (
        'type' => 'varchar(45)',
        'description' => 'DEFAULT NULL',
      ),
      'attempt' => 
      array (
        'type' => 'int(11)',
        'description' => 'DEFAULT NULL',
      ),
      'created' => 
      array (
        'type' => 'datetime',
        'description' => 'DEFAULT CURRENT_TIMESTAMP',
      ),
      'updated' => 
      array (
        'type' => 'datetime',
        'description' => 'DEFAULT NULL',
      ),
    ),
    'pks' => 
    array (
      0 => 'pk_cms_login_attempt',
    ),
    'engine' => 'InnoDB',
    'charset' => 'utf8',
  ),
  'FIELDS' => 
  array (
    'id' => 'pk_cms_login_attempt',
    'pk_cms_login_attempt' => false,
    'ip' => true,
    'attempt' => true,
    'created' => true,
    'updated' => true,
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
        'id' => 'pk_cms_login_attempt',
        'ip' => true,
        'attempt' => true,
        'created' => true,
        'updated' => true,
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