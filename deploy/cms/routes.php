<?php

    $app = new Silex\Application();
    $app['debug'] = true;

    $app['user.controller'] = function() {
        return new controller\User;
    };

    $app->get('/', function() use ($app) {
        return $app['user.controller']->authenticate();
    });

    $app->get('/dashboard/user/index', function () use ($app) {
        return $app['user.controller']->index();
    });

    $app->get('/hello/{name}', function ($name) use ($app) {
        return '<h1>Example</h1> <p>Hello '.$app->escape($name) . '</p>';
    });

    $app->run();