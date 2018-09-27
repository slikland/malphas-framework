<?php
use core\Route;
use core\RouteApi;

#      __   ____  __
#     / _\ (  _ \(  )
#    /    \ ) __/ )(
#    \_/\_/(__)  (__)
#
#      R O U T E S


    RouteApi::add('/', 'User@index');

    RouteApi::run();