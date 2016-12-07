<?php
$_schema_cms_interface = array (
  '__schema' => 
  array (
    'columns' => 
    array (
      'pk_cms_interface' => 
      array (
        'type' => 'int(11)',
        'description' => 'NOT NULL AUTO_INCREMENT',
      ),
      'fk_cms_interface' => 
      array (
        'type' => 'int(11)',
        'description' => 'DEFAULT \'0\'',
      ),
      'name' => 
      array (
        'type' => 'varchar(255)',
        'description' => 'DEFAULT NULL',
      ),
      'path' => 
      array (
        'type' => 'varchar(255)',
        'description' => 'DEFAULT NULL',
      ),
      'order' => 
      array (
        'type' => 'int(11)',
        'description' => 'DEFAULT \'0\'',
      ),
      'created' => 
      array (
        'type' => 'datetime',
        'description' => 'DEFAULT CURRENT_TIMESTAMP',
      ),
      'visible' => 
      array (
        'type' => 'tinyint(1)',
        'description' => 'DEFAULT \'1\'',
      ),
      'type' => 
      array (
        'type' => 'varchar(255)',
        'description' => 'DEFAULT \'\'',
      ),
    ),
    'pks' => 
    array (
      0 => 'pk_cms_interface',
    ),
    'engine' => 'InnoDB',
    'charset' => 'utf8',
  ),
  'FIELDS' => 
  array (
    'id' => 'pk_cms_interface',
    'pk_cms_interface' => false,
    'cms_interface_id' => 'cms_interface.pk_cms_interface',
    'name' => true,
    'path' => true,
    'order' => true,
    'created' => true,
    'visible' => true,
    'type' => true,
  ),
  'REFS' => 
  array (
    'cms_interface' => 'cms_interface.pk_cms_interface = cms_interface.fk_cms_interface',
  ),
  'VIEWS' => 
  array (
    'default' => 
    array (
      'fields' => 
      array (
        'id' => 'pk_cms_interface',
        'cms_interface_id' => 'cms_interface.pk_cms_interface',
        'name' => true,
        'path' => true,
        'order' => true,
        'created' => true,
        'visible' => true,
        'type' => true,
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