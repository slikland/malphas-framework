<?php
    require CORE_PATH . 'Autoload.php';

    $autoload = new Autoload();

    $directories = [
        CORE_PATH . 'Utils' . DIRECTORY_SEPARATOR,
        APP_PATH  . 'model' . DIRECTORY_SEPARATOR,
        CORE_PATH,
    ];

    $autoload->load($directories);