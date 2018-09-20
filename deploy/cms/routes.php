<?php
    use core\Route;
    use core\RouteCms;

    /**
     *
     */

    Route::add('/', 'Auth@login');

    RouteCms::run();