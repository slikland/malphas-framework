<?php
    $phpMinVersion = '5.6';

    // Check PHP Version
    if (version_compare(phpversion(), $phpMinVersion, '<')) {
        die("PHP >= $phpMinVersion is Required");
    }

    if (!extension_loaded('pdo')) {
        die('PDO is Required');
    }