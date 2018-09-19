<?php
    define('ROOT', dirname(dirname(dirname(__DIR__))) . DIRECTORY_SEPARATOR);
    define('API_PATH', ROOT . 'api' . DIRECTORY_SEPARATOR);
    define('APP_PATH', API_PATH . 'app' . DIRECTORY_SEPARATOR);
    define('CORE_PATH', API_PATH . 'core' . DIRECTORY_SEPARATOR);
    define('DYNAMIC_PATH', ROOT . 'dynamic' . DIRECTORY_SEPARATOR);


    define('CMS_PATH', ROOT . 'cms' . DIRECTORY_SEPARATOR);
    define('CONTROLLER_PATH', ROOT . 'cms' . DIRECTORY_SEPARATOR . 'controller' . DIRECTORY_SEPARATOR);
    define('VIEWS_PATH', CMS_PATH . 'view' . DIRECTORY_SEPARATOR);