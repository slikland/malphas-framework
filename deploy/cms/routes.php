<?php
use core\Route;
use core\RouteCms;

#     ___  _  _  ____
#    / __)( \/ )/ ___)
#   ( (__ / \/ \\___ \
#    \___)\_)(_/(____/
#
#       R O U T E S

    Route::add('/', 'Auth@login');

    RouteCms::run();