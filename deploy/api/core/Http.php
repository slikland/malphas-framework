<?php
namespace core;

class Http
{
    public static function userAgent()
    {
        return filter_input( INPUT_SERVER, 'HTTP_USER_AGENT' );
    }

    public static function method()
    {
        return filter_input( INPUT_SERVER, 'REQUEST_METHOD' );
    }

    public static function isPost()
    {
        if(self::method() === 'POST') {
            return true;
        }

        return false;
    }

    public static function isGet()
    {
        if(self::method() === 'GET') {
            return true;
        }

        return false;
    }

    public static function isPut()
    {
        if(self::method() === 'PUT') {
            return true;
        }

        return false;
    }

    public static function isDelete()
    {
        if(self::method() === 'DELETE') {
            return true;
        }

        return false;
    }

    public static function getPost($index = false)
    {
        if($index && !empty($_POST[$index])) {
            return $_POST[$index];
        }

        return $_POST;
    }

    public static function status($status)
    {
        return http_response_code($status);
    }

    public static function statusMessage($status)
    {
        switch ($status){
            case '100':
                $message = '100 Continue';
                break;
            case '101':
                $message = '101 Switching Protocol';
                break;
            case '102':
                $message = '102 Processing (WebDAV)';
                break;
            case '200':
                $message = '200 OK';
                break;
            case '201':
                $message = '201 Created';
                break;
            case '202':
                $message = '202 Accepted';
                break;
            case '203':
                $message = '203 Non-Authoritative Information';
                break;
            case '204':
                $message = '204 No Content';
                break;
            case '205':
                $message = '205 Reset Content';
                break;
            case '206':
                $message = '206 Partial Content';
                break;
            case '207':
                $message = '207 Multi-Status (WebDAV)';
                break;
            case '208':
                $message = '208 Multi-Status (WebDAV)';
                break;
            case '226':
                $message = '226 IM Used (HTTP Delta encoding)';
                break;
            case '300':
                $message = '300 Multiple Choice';
                break;
            case '301':
                $message = '301 Moved Permanently';
                break;
            case '302':
                $message = '302 Found';
                break;
            case '303':
                $message = '303 See Other';
                break;
            case '304':
                $message = '304 Not Modified';
                break;
            case '305':
                $message = '305 Use Proxy ';
                break;
            case '306':
                $message = '306 unused ';
                break;
            case '307':
                $message = '307 Temporary Redirect';
                break;
            case '308':
                $message = '308 Permanent Redirect';
                break;
            case '400':
                $message = '400 Bad Request';
                break;
            case '401':
                $message = '401 Unauthorized';
                break;
            case '402':
                $message = '402 Payment Required';
                break;
            case '403':
                $message = '403 Forbidden';
                break;
            case '404':
                $message = '404 Not Found';
                break;
            case '405':
                $message = '405 Method Not Allowed';
                break;
            case '406':
                $message = '406 Not Acceptable';
                break;
            case '407':
                $message = '407 Proxy Authentication Required';
                break;
            case '408':
                $message = '408 Request Timeout';
                break;
            case '409':
                $message = '409 Conflict';
                break;
            case '410':
                $message = '410 Gone';
                break;
            case '411':
                $message = '411 Length Required';
                break;
            case '412':
                $message = '412 Precondition Failed';
                break;
            case '413':
                $message = '413 Payload Too Large';
                break;
            case '414':
                $message = '414 URI Too Long';
                break;
            case '415':
                $message = '415 Unsupported Media Type';
                break;
            case '416':
                $message = '416 Requested Range Not Satisfiable';
                break;
            case '417':
                $message = '417 Expectation Failed';
                break;
            case '418':
                $message = '418 I\'m a teapot';
                break;
            case '421':
                $message = '421 Misdirected Request';
                break;
            case '422':
                $message = '422 Unprocessable Entity (WebDAV)';
                break;
            case '423':
                $message = '423 Locked (WebDAV)';
                break;
            case '424':
                $message = '424 Failed Dependency (WebDAV)';
                break;
            case '426':
                $message = '426 Upgrade Required';
                break;
            case '428':
                $message = '428 Precondition Required';
                break;
            case '429':
                $message = '429 Too Many Requests';
                break;
            case '431':
                $message = '431 Request Header Fields Too Large';
                break;
            case '451':
                $message = '451 Unavailable For Legal Reasons';
                break;
            case '500':
                $message = '500 Internal Server Error';
                break;
            case '501':
                $message = '501 Not Implemented';
                break;
            case '502':
                $message = '502 Bad Gateway';
                break;
            case '503':
                $message = '503 Service Unavailable';
                break;
            case '504':
                $message = '504 Gateway Timeout';
                break;
            case '505':
                $message = '505 HTTP Version Not Supported';
                break;
            case '506':
                $message = '506 Variant Also Negotiates';
                break;
            case '507':
                $message = '507 Insufficient Storage';
                break;
            case '508':
                $message = '508 Loop Detected (WebDAV)';
                break;
            case '510':
                $message = '510 Not Extended';
                break;
            case '511':
                $message = '511 Network Authentication Required';
                break;
        }
        return $message;
    }

    public static function contentType($contentType)
    {
        return header("Content-Type: $contentType");
    }

    public static function redirect($path)
    {
        header("Location:" . $path);
    }
}