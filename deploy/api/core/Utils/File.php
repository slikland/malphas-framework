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
            $fullName = self::gernerateFileName($value);

            if(!file_exists($fileTmp)) {
                return false;
            }

            if(!is_dir(UPLOAD_PATH)) {
                self::mkdir(UPLOAD_PATH, 0777);
            }

            array_push($files, array(
                'name'  => $fullName,
                'ext'   => self::getExtension($value),
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

        return array(
            'name'      => implode('-', $explode),
            'extension' => $extension,
        );
    }

    public static function gernerateFileName($fileName)
    {
        $fileName       = substr(Str::slugfy(self::getName($fileName)), 0, 200) . '-' .uniqid();
        $fileExtension  = self::getExtension($fileName);

        return $fileName . '.' . $fileExtension;
    }

    public static function convertByteToMega($size, $precision = 2)
    {
        $base = log($size, 1024);
        $suffixes = array('B', 'KB', 'MB', 'GB', 'TB');
        return round(pow(1024, $base - floor($base)), $precision) .' '. $suffixes[floor($base)];
    }


}