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
        array('icon' => 'fas fa-file', 'ext' => array('')),
        array('icon' => 'fas fa-file-image', 'ext' => array('jpg', 'jpeg', 'gif', 'png', 'bmp', 'tiff')),
        array('icon' => 'fas fa-file-audio', 'ext' => array('mp3', 'wma', 'wav')),
        array('icon' => 'fas fa-file-video', 'ext' => array('video', 'mov', 'mp4', 'avi', 'webm')),
        array('icon' => 'fas fa-file-word', 'ext' => array('doc', 'docx')),
        array('icon' => 'fas fa-file-powerpoint', 'ext' => array('ppt', 'pptx')),
        array('icon' => 'fas fa-file-excel', 'ext' => array('xls', 'xlsx', 'csv')),
        array('icon' => 'fas fa-file-pdf', 'ext' => array('pdf')),
        array('icon' => 'fas fa-file-archive', 'ext' => array('zip', 'rar', 'tar')),
        array('icon' => 'fas fa-file-code', 'ext' => array('html', 'htm', 'php', 'js', 'css', 'less', 'sass')),
        array('icon' => 'fas fa-terminal', 'ext' => array('sh')),
        array('icon' => 'fas fa-signature', 'ext' => array('')),
        array('icon' => 'fas fa-contract', 'ext' => array('')),
        array('icon' => 'fas fa-fingerprint', 'ext' => array('key', 'pem'))
    );

    foreach ($iconByExtension as $key => $value) {
        if(in_array($extension, $value['ext'])) {
            return $value['icon'];
        }
    }

}