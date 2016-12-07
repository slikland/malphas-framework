<?php
$_schema_cms_log = array (
  '__schema' => 
  array (
    'columns' => 
    array (
      'pk_cms_log' => 
      array (
        'type' => 'int(11)',
        'description' => 'NOT NULL AUTO_INCREMENT',
      ),
      'fk_cms_session' => 
      array (
        'type' => 'int(11)',
        'description' => 'DEFAULT NULL',
      ),
      'action' => 
      array (
        'type' => 'varchar(255)',
        'description' => 'DEFAULT NULL',
      ),
      'created' => 
      array (
        'type' => 'datetime',
        'description' => 'DEFAULT CURRENT_TIMESTAMP',
      ),
    ),
    'pks' => 
    array (
      0 => 'pk_cms_log',
    ),
    'keys' => 
    array (
      0 => 
      array (
        'name' => 'cms_log_cms_session_idx',
        'column' => 'fk_cms_session',
      ),
    ),
    'constraints' => 
    array (
      0 => 
      array (
        'name' => 'cms_log_cms_session',
        'column' => 'fk_cms_session',
        'description' => 'REFERENCES `cms_session` (`pk_cms_session`) ON DELETE SET NULL ON UPDATE SET NULL',
      ),
    ),
    'engine' => 'InnoDB',
    'charset' => 'utf8',
  ),
  'FIELDS' => 
  array (
    'id' => 'pk_cms_log',
    'pk_cms_log' => false,
    'cms_session_id' => 'cms_session.pk_cms_session',
    'action' => true,
    'created' => true,
  ),
  'REFS' => 
  array (
    'cms_session' => 'cms_session.pk_cms_session = cms_log.fk_cms_session',
  ),
  'VIEWS' => 
  array (
    'default' => 
    array (
      'fields' => 
      array (
        'id' => 'pk_cms_log',
        'cms_session_id' => 'cms_session.pk_cms_session',
        'action' => true,
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