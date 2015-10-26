<?php
global $errorCodes;
$errorCodes = array(
	// AUTHENTICATION ERRORS codes 0~99
	'not logged'=>array(1, 'User not logged'),
	'no permission'=>array(2, 'User doesn\'t have permission'),
	'user not found'=>array(3, 'User doesn\'t exist'),


	// SERVICE ERRORS codes 100~200
	'service not found'=>array(100, 'Service not found'),
	'validation'=>array(101, 'Please fill in the fields correctly'),
);
?>