<?php
$_schema_cms_interface_role = array (
  '__schema' => 
  array (
    'columns' => 
    array (
      'pk_cms_interface_role' => 
      array (
        'type' => 'int(11)',
        'description' => 'NOT NULL AUTO_INCREMENT',
      ),
      'fk_cms_interface' => 
      array (
        'type' => 'int(11)',
        'description' => 'DEFAULT NULL',
      ),
      'fk_cms_role' => 
      array (
        'type' => 'int(11)',
        'description' => 'DEFAULT NULL',
      ),
      'created' => 
      array (
        'type' => 'datetime',
        'description' => 'DEFAULT NULL',
      ),
    ),
    'pks' => 
    array (
      0 => 'pk_cms_interface_role',
    ),
    'keys' => 
    array (
      0 => 
      array (
        'name' => 'cms_interface_role_cms_interface_idx',
        'column' => 'fk_cms_interface',
      ),
      1 => 
      array (
        'name' => 'cms_interface_role_cms_role_idx',
        'column' => 'fk_cms_role',
      ),
    ),
    'constraints' => 
    array (
      0 => 
      array (
        'name' => 'cms_interface_role_cms_interface',
        'column' => 'fk_cms_interface',
        'description' => 'REFERENCES `cms_interface` (`pk_cms_interface`) ON DELETE SET NULL ON UPDATE SET NULL',
      ),
      1 => 
      array (
        'name' => 'cms_interface_role_cms_role',
        'column' => 'fk_cms_role',
        'description' => 'REFERENCES `cms_role` (`pk_cms_role`) ON DELETE SET NULL ON UPDATE SET NULL',
      ),
    ),
    'engine' => 'InnoDB',
    'charset' => 'utf8',
  ),
  'FIELDS' => 
  array (
    'id' => 'pk_cms_interface_role',
    'pk_cms_interface_role' => false,
    'cms_interface_id' => 'cms_interface.pk_cms_interface',
    'fk_cms_interface' => false,
    'cms_role_id' => 'cms_role.pk_cms_role',
    'fk_cms_role' => false,
    'created' => true,
  ),
  'REFS' => 
  array (
    'cms_interface' => 'cms_interface.pk_cms_interface = cms_interface_role.fk_cms_interface',
    'cms_role' => 'cms_role.pk_cms_role = cms_interface_role.fk_cms_role',
  ),
  'VIEWS' => 
  array (
    'default' => 
    array (
      'fields' => 
      array (
        'id' => 'pk_cms_interface_role',
        'cms_interface_id' => 'cms_interface.pk_cms_interface',
        'cms_role_id' => 'cms_role.pk_cms_role',
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