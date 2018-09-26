<?php
    define('ROOT', dirname(dirname(dirname(__DIR__))) . DIRECTORY_SEPARATOR);
    define('SERVICES_NAME', 'api');
    define('MANAGEMENT_NAME', 'cms');


    define('API_PATH', ROOT . SERVICES_NAME . DIRECTORY_SEPARATOR);
    define('APP_PATH', API_PATH . 'app' . DIRECTORY_SEPARATOR);
    define('SERVICE_PATH', APP_PATH . 'service' . DIRECTORY_SEPARATOR);
    define('CORE_PATH', API_PATH . 'core' . DIRECTORY_SEPARATOR);
    define('DYNAMIC_PATH', ROOT . 'dynamic' . DIRECTORY_SEPARATOR);


    define('CMS_PATH', ROOT . 'cms' . DIRECTORY_SEPARATOR);
    define('CONTROLLER_PATH', ROOT . 'cms' . DIRECTORY_SEPARATOR . 'controller' . DIRECTORY_SEPARATOR);
    define('VIEWS_PATH', CMS_PATH . 'view' . DIRECTORY_SEPARATOR);

    define('BASE_URL', 'http://local.slikland.com/slikland-cms-lab/deploy/cms/');
    define('ASSETS_URL', BASE_URL . 'view' . DIRECTORY_SEPARATOR . '_assets' . DIRECTORY_SEPARATOR);

