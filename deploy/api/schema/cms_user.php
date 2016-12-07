<?php
$_schema_cms_user = array (
  '__schema' => 
  array (
    'columns' => 
    array (
      'pk_cms_user' => 
      array (
        'type' => 'int(11)',
        'description' => 'NOT NULL AUTO_INCREMENT',
      ),
      'fk_cms_role' => 
      array (
        'type' => 'int(11)',
        'description' => 'DEFAULT NULL',
      ),
      'email' => 
      array (
        'type' => 'varchar(255)',
        'description' => 'DEFAULT NULL',
      ),
      'pass' => 
      array (
        'type' => 'varchar(255)',
        'description' => 'DEFAULT NULL',
      ),
      'name' => 
      array (
        'type' => 'varchar(255)',
        'description' => 'DEFAULT NULL',
      ),
      'created' => 
      array (
        'type' => 'datetime',
        'description' => 'DEFAULT CURRENT_TIMESTAMP',
      ),
      'status' => 
      array (
        'type' => 'int(11)',
        'description' => 'DEFAULT \'1\'',
      ),
      'password_changed' => 
      array (
        'type' => 'datetime',
        'description' => 'DEFAULT NULL',
      ),
      'checksum' => 
      array (
        'type' => 'varchar(100)',
        'description' => 'DEFAULT NULL',
      ),
    ),
    'pks' => 
    array (
      0 => 'pk_cms_user',
    ),
    'keys' => 
    array (
      0 => 
      array (
        'name' => 'cms_user_cms_role_idx',
        'column' => 'fk_cms_role',
      ),
    ),
    'constraints' => 
    array (
      0 => 
      array (
        'name' => 'cms_user_cms_role',
        'column' => 'fk_cms_role',
        'description' => 'REFERENCES `cms_role` (`pk_cms_role`) ON DELETE SET NULL ON UPDATE SET NULL',
      ),
    ),
    'engine' => 'InnoDB',
    'charset' => 'utf8',
  ),
  'FIELDS' => 
  array (
    'id' => 'pk_cms_user',
    'pk_cms_user' => false,
    'cms_role_id' => 'cms_role.pk_cms_role',
    'email' => true,
    'pass' => false,
    'name' => true,
    'created' => true,
    'status' => true,
    'password_changed' => false,
    'checksum' => true,
  ),
  'REFS' => 
  array (
    'cms_role' => 'cms_role.pk_cms_role = cms_user.fk_cms_role',
  ),
  'VIEWS' => 
  array (
    'default' => 
    array (
      'fields' => 
      array (
        'id' => 'pk_cms_user',
        'cms_role_id' => 'cms_role.pk_cms_role',
        'email' => true,
        'name' => true,
        'created' => true,
        'status' => true,
        'checksum' => true,
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