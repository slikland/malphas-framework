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