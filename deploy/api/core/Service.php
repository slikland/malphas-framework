<?php
namespace core;
use core\Utils\File;
use core\Utils\Filter;


class Service
{
    public $isAuthenticable = true;


    public function index()
    {
        if(!Http::isGet()){
            return $this->response(405);
        }

        $all = $this->model->all();

        return $this->response(200, $all);
    }

    public function create()
    {
        if(!Http::isPost()){
            return $this->response(405);
        }

        $filteredData = Filter::vetor($this->model->fillable, $_POST);

        return $this->model->insert($filteredData);
    }

    public function read()
    {

    }

    public function update()
    {

    }

    public function delete()
    {

    }

    public static function load($serviceName)
    {
        $file  = !empty(self::find($serviceName)['fileName']) ? self::find($serviceName)['fileName'] : false;
        $class = !empty(self::find($serviceName)['className']) ? self::find($serviceName)['className'] : false;
        $file  = SERVICE_PATH . $file;
        $loadedFile = File::load($file);
        $instance = $loadedFile ? new $class : false;

        return $instance;
    }

    public static function find($serviceName = false)
    {
        $ls = File::ls(SERVICE_PATH);
        $findController = !empty(self::parseServiceName(false, true)) ? self::parseServiceName(false, true) : false;

        if(!empty($serviceName)) {
            $findController = self::parseServiceName($serviceName, true);
        }

        foreach ($ls as $key => $file) {
            $toCompare = mb_strtolower($file);

            if($toCompare == $findController) {
                return [
                    'fileName' => $file,
                    'className' => str_replace('.php', '', $file)
                ];
            }

        }

        return false;
    }

    public static function parseServiceName($controllerName = false, $withExtension = false)
    {
        $name = !empty(Route::getRequestParams()['class']) ? mb_strtolower(Route::getRequestParams()['class']) . 'controller' : null;

        if ($controllerName) {
            $name = mb_strtolower($controllerName) . 'service';
        }

        if($withExtension) {
            $name = $name . '.php';
        }

        return $name;
    }

    private function response($status, $data = false)
    {
        Http::status($status);
        Http::contentType('application/json');

        if(!$data) {
            $data = Http::statusMessage($status);
        }

        print json_encode($data);
    }
}