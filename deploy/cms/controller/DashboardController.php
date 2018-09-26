<?php

use core\Controller;

class DashboardController extends Controller
{
    public function index()
    {
        return $this->view('dashboard/index', array(
            'pageTitle' => 'Dashboard',
            'pageSubTitle' => 'Resumo Geral'
        ));
    }

}