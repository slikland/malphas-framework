<?php
use core\Controller;
use core\Auth;
use core\JsonResponse;

class AuthController extends Controller
{
    public $isAuthenticable = false;

    public function index()
    {
        if(Auth::isValidLogin()) {
            Auth::init();
            $redirectTo = Auth::$redirectTo;
            $return = [
                'success' => true,
                'redirect' => $redirectTo
            ];
            return JsonResponse::set(200, $return);
        }

        $return = ['message' => 'Usuário/Senha invalido(s)'];
        return JsonResponse::set(401, $return);
    }

    public function login()
    {
        return $this->view('auth/login');
    }

    public function forgotpassword()
    {
        return $this->view('auth/forgot-password');
    }

    public function logout()
    {
        Auth::destroy();

        return $this->view('auth/login', array(
            'message' => 'Logout realizado com sucesso.'
        ));
    }
}