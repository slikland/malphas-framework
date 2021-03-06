<?php
namespace core;

use core\Utils\Cypher;
use core\Utils\Hash;
use DateTime;
use DateInterval;
use model\User;

class Auth
{
    protected $inactivity       = 60;
    public  static $redirectTo  = 'dashboard';
    private static $expire      = '2 hours';
    private static $cookieName  = 'auth_cms';

    public static function init()
    {
        return setcookie(self::$cookieName, Cypher::encrypt(self::userAgentIp()), self::expire(), '/');
    }

    public static function isLoggedIn()
    {
        if(empty($_COOKIE[self::$cookieName])) {
            Http::redirect(BASE_URL);
        }

        $decrypt     = Cypher::decrypt($_COOKIE[self::$cookieName]);
        $userAgentIp = self::userAgentIp();

        if($decrypt != $userAgentIp) {
            Http::redirect(BASE_URL);
        }
    }

    public static function destroy()
    {
        return setcookie(self::$cookieName,"has_no_cookie",time()-1, '/');
    }

    public static function isValidLogin()
    {
        $post = Http::getPost();
        $user = User::getByEmail($post['email']);

        if(is_null($user)) {
            return false;
        }

        $password = $user->password;
        $isValidLogin = Hash::verify($post['password'], $password);

        return $isValidLogin;
    }

    private static function expire()
    {
        $now = new DateTime();
        $now->add(
            DateInterval::createFromDateString(self::$expire)
        );

        return $now->getTimestamp();
    }

    private static function userAgentIp()
    {
        $ua = Http::userAgent();
        $ip = $_SERVER['REMOTE_ADDR']; // TODO: usar metodo do framework antigo
        return 'ua=' . $ua . '&ip=' . $ip;
    }

}