<?php
namespace core\Utils;

class Cypher
{
    private static $key = KEY;

    public static function encrypt($text)
    {
        $ivlen      = openssl_cipher_iv_length($c="AES-128-CBC");
        $iv         = openssl_random_pseudo_bytes($ivlen);
        $c_text_raw = openssl_encrypt($text, $c, self::$key, $options=OPENSSL_RAW_DATA, $iv);
        $hmac       = hash_hmac('sha256', $c_text_raw, self::$key, $as_binary=true);

        return base64_encode($iv.$hmac.$c_text_raw);
    }

    public static function decrypt($text)
    {
        $c = base64_decode($text);
        $ivlen = openssl_cipher_iv_length($cipher="AES-128-CBC");
        $iv = substr($c, 0, $ivlen);
        $hmac = substr($c, $ivlen, $sha2len=32);
        $text_raw = substr($c, $ivlen+$sha2len);
        $decrypted = openssl_decrypt($text_raw, $cipher, self::$key, $options=OPENSSL_RAW_DATA, $iv);
        $calcmac = hash_hmac('sha256', $text_raw, self::$key, $as_binary=true);

        if (hash_equals($hmac, $calcmac))
        {
            return $decrypted;
        }
    }

}