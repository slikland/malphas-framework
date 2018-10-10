<?php
use model\User;
use model\Role;
use core\Controller;

class DashboardController extends Controller
{
    public function index()
    {
        return $this->view('dashboard/index', array(
            'pageTitle' => 'Dashboard',
            'pageSubTitle' => 'Resumo Geral',
            'totalUser' => count(User::all()),
            'totalRole' => count(Role::all()),
        ));
    }

}