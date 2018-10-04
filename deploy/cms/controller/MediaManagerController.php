<?php

use core\Controller;
use core\JsonResponse;

class MediaManagerController extends Controller
{
    public function index()
    {
        $fileList = array(

            array(
                'name' => '',
                'path' => '',
                'alt' => '',
                'type' => 'file',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),

            ),
            array(
                'type' => 'word'
            ),
            array(
                'type' => 'powerpoint'
            ),
            array(
                'type' => 'medical'
            ),
            array(
                'type' => 'image'
            ),
            array(
                'type' => 'code'
            ),
            array(
                'type' => 'audio'
            ),
            array(
                'type' => 'video'
            ),
            array(
                'type' => 'archive'
            ),
            array(
                'type' => 'pdf'
            ),
            array(
                'type' => 'signature'
            ),
            array(
                'type' => 'excel'
            ),
            array(
                'type' => 'contract'
            ),
            array(
                'type' => 'alt'
            ),
            array(
                'type' => 'download'
            ),
            array(
                'type' => 'upload'
            ),
            array(
                'type' => 'invoice'
            ),
            array(
                'type' => 'invoice-dollar'
            )
        );

        shuffle($fileList);

        return $this->view('media-manager/index', array(
            'pageTitle' => 'Gerenciador de Media',
            'pageSubTitle' => 'Todos Arquivos',
            //'files' => $fileList,
            'files' => array(),
        ));
    }



    public function ajax($param = false)
    {
        if(empty($param)) {
            $param = array('empty');
        }

        return JsonResponse::set(200, $param);
    }

}