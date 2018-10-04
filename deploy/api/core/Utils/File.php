<?php
namespace core\Utils;

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
        $statusSave = array();

        foreach ($postFile['file']['name'] as $key => $value) {

            $fileTmp = $postFile['file']['tmp_name'][$key];

            if(!file_exists($fileTmp)) {
                return false;
            }

            if(!is_dir(UPLOAD_PATH)) {
                self::mkdir(UPLOAD_PATH, 0777);
            }

            $nameExt = explode('.', $value);
            $name = substr(Str::slugfy($nameExt[0]), 0, 200) . '-' .uniqid();

            array_push($files, array(
                'name'  => $name . '.' . $nameExt[1],
                'ext'   => $nameExt[1],
                'type'  => $postFile['file']['type'][$key],
                'size'  => $postFile['file']['size'][$key],
            ));

            if(move_uploaded_file($fileTmp,UPLOAD_PATH . $name . '.' . $nameExt[1])) {
                array_push($statusSave, $files);
            } else {
                array_push($statusSave, array(
                    'error' => true,
                ));
            }

        }
        return $statusSave;
    }

}