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
            return JsonResponse::set(405);
        }

        $all = $this->model->all();

        return JsonResponse::set(200, $all);
    }

    public function create()
    {
        if(!Http::isPost()){
            return JsonResponse::set(405);
        }

        $filteredData = Filter::vetor($this->model->fillable, $_POST);

        return $this->model->insert($filteredData);
    }

    public function read($id)
    {
        if(!Http::isGet()){
            return JsonResponse::set(405);
        }

        $get = $this->model->get($id);

        if(is_null($get)) {
            return JsonResponse::set(404);
        }

        return JsonResponse::set(200, $this->model->get($id));
    }

    public function update($id)
    {
        if(!Http::isPost()){
            return JsonResponse::set(405);
        }

        $filteredData = Filter::vetor($this->model->fillable, $_POST);

        return $this->model->update($id, $filteredData);
    }

    public function delete($id)
    {
        return $this->model->delete($id);
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

    public static function execute($service, $method, $parameters = false)
    {
        $instance = self::load($service);

        if($method && $parameters) {
            $instance->{$method}($parameters);
        } elseif ($method) {
            if(method_exists ($instance, $method)) {
                $instance->{$method}();
            } else {
                http_response_code(404);
                echo "404";
            }
        }
    }

    public static function parseServiceName($serviceName = false, $withExtension = false)
    {
        $name = !empty(RouteApi::getRequestApi()['class']) ? mb_strtolower(RouteApi::getRequestApi()['class']) . 'service' : null;

        if ($serviceName) {
            $name = mb_strtolower($serviceName) . 'service';
        }

        if($withExtension) {
            $name = $name . '.php';
        }

        return $name;
    }

}