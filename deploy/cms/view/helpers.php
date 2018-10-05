<?php

function inc($path) {
    require_once VIEWS_PATH . $path;
}

function baseUrl($path = null) {
    return BASE_URL . $path;
}

function baseUrlUpload($path = null) {
    return baseUrl('../dynamic/uploads/' . $path);
}

function asset($file) {
    return ASSETS_URL . $file;
}

function css($file) {
    return ASSETS_URL . 'css/' . $file. '.css';
}

function js($file) {
    return ASSETS_URL  . 'js/'. $file . '.js';
}

function image($file) {
    return ASSETS_URL  . 'image/'. $file;
}

function title() {
    return APP_NAME;
}

function dateFormatBR($databaseTimeStamp)
{
    $date = null;

    if(!empty($databaseTimeStamp)) {
        $date = DateTime::createFromFormat('Y-m-d H:i:s', $databaseTimeStamp);
        $date = $date->format('d/m/Y - H:i');
    }

    return $date;
}

function mediaIcon($extension = null)
{
    $iconByExtension = array(
        'file'          => array(''),
        'image'         => array('jpg', 'jpeg', 'gif', 'png', 'bmp', 'tiff'),
        'audio'         => array('mp3', 'wma', 'wav'),
        'video'         => array('video', 'mov', 'mp4', 'avi', 'webm'),
        'word'          => array('doc', 'docx'),
        'powerpoint'    => array('ppt', 'pptx'),
        'excel'         => array('xls', 'xlsx', 'csv'),
        'pdf'           => array('pdf'),
        'archive'       => array('zip', 'rar', 'tar'),
        'html5'         => array('html', 'htm'),
        'php'           => array('php'),
        'js'            => array('js'),
        'css3'          => array('css'),
        'less'          => array('less'),
        'sass'          => array('sass'),
        'terminal'      => array('sh'),
        'signature'     => array(''),
        'contract'      => array(''),
        'fingerprint'   => array('key', 'pem')
    );


    return 'file';

}