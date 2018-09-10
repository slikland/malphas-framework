<?php
    // Load API Resources
    require '../api/index.php';

    // Composer Autoload
    include 'vendor/autoload.php';

    // CMS Configs
    include 'configs/config.php';

    // Constants Paths
    include 'configs/paths.php';

    // Routes / Run application
    include 'routes.php';