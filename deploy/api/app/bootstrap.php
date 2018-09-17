<?php
    require CORE_PATH . 'Autoload.php';

    $autoload = new Autoload();

    $directories = [
        APP_PATH . 'model',
        CORE_PATH
    ];

    $autoload->load($directories);