<!DOCTYPE html><?php
include_once('../api/index.php');

$mara = new \slikland\mara\Mara('templates/');
$data = array();

$data['base'] = ROOT_URL . 'cms/';
$data['meta'] = array();
$data['meta'][] = array('name'=>'ROBOTS', 'content'=>'NOINDEX, NOFOLLOW');

$style = file_get_contents('css/main.css');
$colorModule = get_module('cms/Colors');
$style = $colorModule->replaceColors($style);

$data['style'] = $style;
// $data['styles'] = array('css/main.css');
$data['scripts'] = array('js/Main.js', 'js/vendors.js');

$mara->render('index', $data);
