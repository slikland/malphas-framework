<?php
    // App Paths
    require '../api/app/config/paths.php';

    // Check system requirements
    require APP_PATH . 'config/requirement.php';

    // App Config (Database credentials, debug, etc...)
    require APP_PATH . 'config/config.php';

    // Init App
    require APP_PATH . 'bootstrap.php';
