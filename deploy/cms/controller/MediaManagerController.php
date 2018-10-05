<?php
use model\Media;
use core\Controller;
use core\JsonResponse;
use core\Utils\File;

class MediaManagerController extends Controller
{
    public function index()
    {
        $media = new Media();
        return $this->view('media-manager/index', array(
            'pageTitle' => 'Gerenciador de Media',
            'pageSubTitle' => 'Todos Arquivos',
            'files' => $media->all(),
        ));
    }



    public function ajax($param = null)
    {
        if(empty($param)) {
            $param = array('empty');
        }

        return JsonResponse::set(200, $param);
    }

    public function upload()
    {
        if(empty($_FILES)) {
            return JsonResponse::set(200, array(
                'error' => true,
                'message' => 'Nenhuma Arquivo enviado'
            ));
        }

        $upload = File::upload($_FILES);

        if($upload) {

            $media = new Media();
            $isInserted = array();

            foreach ($upload as $key => $data) {
                $isInserted[$key] = $media->insert($data);
            }

            $response = $isInserted;

        } else {
            $response = array(
                'error' => true,
                'data' => $upload,
                'message' => 'Não foi salvo por algum motivo'
            );
        }
        return JsonResponse::set(200, $response);
    }

}