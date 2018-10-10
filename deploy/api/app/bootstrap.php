<?php
    require CORE_PATH . 'Autoload.php';

    $autoload = new Autoload();

    $directories = [
        CORE_PATH . 'ORM' . DIRECTORY_SEPARATOR,
        CORE_PATH . 'ORM' . DIRECTORY_SEPARATOR . 'LessQL' . DIRECTORY_SEPARATOR,
        CORE_PATH . 'Utils' . DIRECTORY_SEPARATOR,
        CORE_PATH . 'Validations' . DIRECTORY_SEPARATOR,
        CORE_PATH . DIRECTORY_SEPARATOR,
        APP_PATH  . 'model' . DIRECTORY_SEPARATOR,
    ];



    $autoload->load($directories);