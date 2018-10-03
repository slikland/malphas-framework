<?php
use model\User;
use model\Role;
use core\Controller;

class DashboardController extends Controller
{
    public function index()
    {
        $users = new User();
        $roles = new Role();

        return $this->view('dashboard/index', array(
            'pageTitle' => 'Dashboard',
            'pageSubTitle' => 'Resumo Geral',
            'totalUser' => count($users->all()),
            'totalRole' => count($roles->all()),
        ));
    }

}