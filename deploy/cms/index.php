<?php
include_once('../api/index.php');
print '<!DOCTYPE html>';
$mara = new \slikland\mara\Mara('templates/');
$data = array();

$data['base'] = CMS_URL;
$data['meta'] = array();
$data['meta'][] = array('name'=>'ROBOTS', 'content'=>'NOINDEX, NOFOLLOW');

$style = file_get_contents('css/main.css');
$colorModule = get_module('cms/Colors');
$style = $colorModule->replaceColors($style);

$data['style'] = $style;
$data['styles'] = array('css/vendors.css');
$data['scripts'] = array('js/Main.js', 'js/vendors.js');
$data['injectScript'] = 'window.rootPath = "'.ROOT_URL.'";window.apiPath = "'.ROOT_URL.'api/";';

$mara->render('index', $data);
