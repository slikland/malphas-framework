<?php

function inc($path) {
    require_once VIEWS_PATH . $path;
}

function baseUrl($path = null) {
    return BASE_URL . $path;
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
        $date = new \DateTime();
        $date::createFromFormat('Y-m-d H:i:s', $databaseTimeStamp);
        $date = $date->format('d/m/Y - H:s');
    }

    return $date;
}