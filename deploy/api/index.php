<?php
include_once('config.php');
include_once('slikland/AutoLoader.php');
include('slikland/core/ServiceController.php');

class_alias('\slikland\core\Setting', 'Setting');
class_alias('\slikland\error\ServiceError', 'ServiceError');
class_alias('\slikland\error\CodedError', 'CodedError');
class_alias('\slikland\fs\File', 'File');



if(realpath($_SERVER['SCRIPT_FILENAME']) == realpath(__FILE__)){
	execute(NULL, NULL, TRUE);
}

