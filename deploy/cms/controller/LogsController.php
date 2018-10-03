<?php
use core\Controller;

class LogsController extends Controller
{
    private $model;

    public function __construct()
    {
        //$this->model = new User();
    }

    public function index()
    {
        $logs = array(
            'saasa',
            'saasa',
            'saasa'
        );

        return $this->view('logs/index', array(
            'pageTitle'     => 'Logs',
            'pageSubTitle'  => 'Auditoria',
            'logs'         => $logs
        ));
    }

}