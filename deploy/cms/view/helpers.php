<?php


function inc($path) {
    require_once VIEWS_PATH . $path;
}

function asset($file) {
    return VIEWS_PATH . '_assets/' . $file;
}

function css($file) {
    return VIEWS_PATH . '_assets/css/' . $file. '.css';
}

function js($file) {
    return VIEWS_PATH . '_assets/js/' . $file . '.js';
}

function image($file) {
    return VIEWS_PATH . '_assets/image/' . $file;
}

function title() {
    return APP_NAME;
}