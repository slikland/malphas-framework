<?php
$_schema_cms_session = array (
  '__schema' => 
  array (
    'columns' => 
    array (
      'pk_cms_session' => 
      array (
        'type' => 'int(11)',
        'description' => 'NOT NULL AUTO_INCREMENT',
      ),
      'fk_cms_user' => 
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
      'ip' => 
      array (
        'type' => 'varchar(45)',
        'description' => 'DEFAULT NULL',
      ),
      'status' => 
      array (
        'type' => 'int(11)',
        'description' => 'DEFAULT \'1\'',
      ),
    ),
    'pks' => 
    array (
      0 => 'pk_cms_session',
    ),
    'keys' => 
    array (
      0 => 
      array (
        'name' => 'cms_session_cms_user_idx',
        'column' => 'fk_cms_user',
      ),
    ),
    'constraints' => 
    array (
      0 => 
      array (
        'name' => 'cms_session_cms_user',
        'column' => 'fk_cms_user',
        'description' => 'REFERENCES `cms_user` (`pk_cms_user`) ON DELETE SET NULL ON UPDATE SET NULL',
      ),
    ),
    'engine' => 'InnoDB',
    'charset' => 'utf8',
  ),
  'FIELDS' => 
  array (
    'id' => 'pk_cms_session',
    'pk_cms_session' => false,
    'cms_user_id' => 'cms_user.pk_cms_user',
    'created' => true,
    'updated' => true,
    'ip' => true,
    'status' => true,
  ),
  'REFS' => 
  array (
    'cms_user' => 'cms_user.pk_cms_user = cms_session.fk_cms_user',
  ),
  'VIEWS' => 
  array (
    'default' => 
    array (
      'fields' => 
      array (
        'id' => 'pk_cms_session',
        'cms_user_id' => 'cms_user.pk_cms_user',
        'created' => true,
        'updated' => true,
        'ip' => true,
        'status' => true,
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