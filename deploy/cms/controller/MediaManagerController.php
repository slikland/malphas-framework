<?php

use core\Controller;

class MediaManagerController extends Controller
{
    public function index()
    {
        return $this->view('media-manager/index', array(
            'pageTitle' => 'Gerenciador de Media',
            'pageSubTitle' => 'Todos Arquivos'
        ));
    }



}