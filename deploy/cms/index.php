<?php

    #     ___  _  _  ____
    #    / __)( \/ )/ ___)
    #   ( (__ / \/ \\___ \
    #    \___)\_)(_/(____/
    #
    #       I N D E X

    // App Paths
    require_once '../api/app/config/paths.php';

    // Check system requirements
    require_once APP_PATH . 'config/requirement.php';

    // Init App
    require_once APP_PATH . 'bootstrap.php';

    // App Config (Database credentials, debug, etc...)
    require_once APP_PATH . 'config/config.php';

    // Routes
    require_once CMS_PATH . 'routes.php';