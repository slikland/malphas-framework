<?php

    #      __   ____  __
    #     / _\ (  _ \(  )
    #    /    \ ) __/ )(
    #    \_/\_/(__)  (__)
    #
    #       I N D E X

    // App Paths
    require_once __DIR__ . DIRECTORY_SEPARATOR . 'app/config/paths.php';

    // Check system requirements
    require_once APP_PATH . 'config/requirement.php';

    // Init App
    require_once APP_PATH . 'bootstrap.php';

    // App Config (Database credentials, debug, etc...)
    require_once APP_PATH . 'config/config.php';

    // Routes
     require_once 'routes.php';