<?php
namespace slikland\error;
class AuthenticationError extends Error
{
	protected static $INIT_CODE = 0;
	protected static $ERRORS = array(
		'not logged'=>array(1, 'User not logged'),
		'no permission'=>array(2, 'User doesn\'t have permission')
	);
}

?>