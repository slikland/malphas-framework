<?php

use core\Controller;

class ErrorController extends Controller
{
    public function error404()
    {
        return $this->view('_error/404', array(
            'pageTitle' => 'Página não encontrada',
            'pageSubTitle' => '404'
        ));
    }


    public function error500()
    {
        return $this->view('_error/500', array(
            'pageTitle' => 'Error',
            'pageSubTitle' => ''
        ));
    }


    public function error401()
    {
        return $this->view('_error/401', array(
            'pageTitle' => 'Error',
            'pageSubTitle' => ''
        ));
    }

}