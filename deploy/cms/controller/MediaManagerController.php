<?php
use model\Media;
use core\Controller;
use core\Utils\Filter;
use core\JsonResponse;
use core\Utils\File;
use core\Http;

class MediaManagerController extends Controller
{
    public function __construct()
    {
        $this->model = new Media();
    }

    public function index()
    {
        return $this->view('media-manager/index', array(
            'pageTitle' => 'Gerenciador de Media',
            'pageSubTitle' => 'Todos Arquivos',
            'files' => $this->model->all(),
        ));
    }

    public function create()
    {
        return $this->view('media-manager/create', array(
            'pageTitle'     => 'Adicionar Media',
            'pageSubTitle'  => ''
        ));
    }

    public function insert()
    {
        $filteredData = Filter::vetor($this->model->fillable, $_POST);
        $filteredData['password'] = Hash::generate($filteredData['password']);
        $insert = $this->model->insert($filteredData);
        $response = parent::parseResponse($insert);

        return JsonResponse::set(200, $response);
    }

    public function edit($id)
    {
        return $this->view('media-manager/create', array(
            'pageTitle'     => 'Editar Arquivo',
            'pageSubTitle'  => '',
            'media'          => $this->model->get($id),
        ));
    }

    public function update($id)
    {
        $oldFile = $this->model->get($id);
        $getPost = Http::getPost();
        $getPost['name'] = $getPost['name'].'.'.$getPost['ext'];
        $filteredData = Filter::vetor($this->model->fillable, $getPost);
        $update = $this->model->update($id, $filteredData);

        if($update) {
            rename(UPLOAD_PATH . $oldFile['name'], UPLOAD_PATH . $getPost['name']);
            $response = parent::parseResponse($update);
        } else {
            $response = parent::parseResponse(array(
                'error' => true,
                'message' => 'Erro ao renomear arquivo'
            ));
        }

        return JsonResponse::set(200, $response);
    }

    public function delete($id)
    {
        $delete = $this->model->delete($id);
        $response = parent::parseResponse($delete);

        return JsonResponse::set(200, $response);
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

            $isInserted = array();

            foreach ($upload as $key => $data) {
                $isInserted[$key] = $this->model->insert($data);
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