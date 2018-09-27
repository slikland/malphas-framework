<?php
    use core\RouteApi;
    use core\JsonResponse;

#      __   ____  __
#     / _\ (  _ \(  )
#    /    \ ) __/ )(
#    \_/\_/(__)  (__)
#
#      R O U T E S

    RouteApi::add('/', function (){
        JsonResponse::set(401);
    });

    RouteApi::run();