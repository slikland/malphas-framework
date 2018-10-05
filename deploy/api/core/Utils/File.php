<?php
namespace core\Utils;
use model\Role;

class File
{
    public static function create($path, $content, $overwrite)
    {

    }

    public static function copy($from, $to)
    {

    }

    public static function move($from, $to)
    {

    }

    public static function delete($file)
    {

    }

    public static function mkdir($path, $chmod = false)
    {
        if(!file_exists($path)) {
            self::mkdir(dirname($path), $chmod);
            mkdir($path, $chmod);
        }
        return true;
    }

    public static function ls($dir, $showHiddenFiles = false)
    {
        $ls = scandir($dir);
        $remove = [
            '.', '..', '.DS_Store'
        ];

        if(!$showHiddenFiles) {
            return array_diff($ls, $remove);
        }

        return $ls;
    }

    public static function load($fullPathFile)
    {
        if(is_file($fullPathFile)){
            require_once $fullPathFile;
            return true;
        }
        return false;
    }

    public static function upload($postFile)
    {
        if(empty($postFile)) {
            return false;
        }

        $files = array();

        foreach ($postFile['file']['name'] as $key => $value) {

            $fileTmp = $postFile['file']['tmp_name'][$key];

            if(!file_exists($fileTmp)) {
                return false;
            }

            if(!is_dir(UPLOAD_PATH)) {
                self::mkdir(UPLOAD_PATH, 0777);
            }

            $fileName       = self::getName($value);
            $fileName       = substr(Str::slugfy($fileName), 0, 200) . '-' .uniqid();
            $fileExtension  = self::getExtension($value);
            $fullName       = $fileName . '.' . $fileExtension;

            array_push($files, array(
                'name'  => $fullName,
                'ext'   => $fileExtension,
                'type'  => $postFile['file']['type'][$key],
                'size'  => $postFile['file']['size'][$key],
            ));

            if(!move_uploaded_file($fileTmp,UPLOAD_PATH . $fullName)) {
                return false;
            }
        }
        return $files;
    }

    public static function getName($fileName)
    {
        return self::explodeNameExtension($fileName)['name'];
    }

    public static function getExtension($fileName)
    {
        return self::explodeNameExtension($fileName)['extension'];
    }

    public static function explodeNameExtension($fileName)
    {
        $explode    = explode('.', $fileName);
        $extension  = end($explode);
        array_pop($explode);
        $name       = implode('-', $explode);

        return array(
            'name'      => $name,
            'extension' => $extension,
        );
    }


}