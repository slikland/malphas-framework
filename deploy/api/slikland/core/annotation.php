<?php
// if(isset($service['params'])) $data = array_merge($data, $service['params']);



//--------------------------------------
// DO NOT CHANGE THIS UNTIL ### COMMENT
//--------------------------------------
add_annotation_callback('authenticate', '\slikland\utils\ServiceAnnotations::authenticate');
add_annotation_callback('permission', '\slikland\utils\ServiceAnnotations::check_permission');
add_annotation_callback('method', '\slikland\utils\ServiceAnnotations::request_method');
add_annotation_callback('params', '\slikland\utils\ServiceAnnotations::merge_params');
add_annotation_callback('validate', '\slikland\utils\ServiceAnnotations::validate_params');
add_annotation_callback('validation', '\slikland\utils\ServiceAnnotations::validate_params');
add_annotation_callback('filename', '\slikland\utils\ServiceAnnotations::set_filename');
add_annotation_callback('output', '\slikland\utils\ServiceAnnotations::set_output');


//######################################
// DO NOT CHANGE ABOVE
//######################################

