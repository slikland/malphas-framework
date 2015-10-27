<?php
global $notificationMessages;
$notificationMessages = array(
	'login error'=>array('message'=>'{Error} no login. Tente novamente', 'type'=>1, 'timeout'=>3),
	'add user success'=>array('message'=>'{User} {added} {successfully}', 'type'=>5, 'timeout'=>0),
	'edit user success'=>array('message'=>'{User} {edited} {successfully}', 'type'=>5, 'timeout'=>0),
	'remove user success'=>array('message'=>'{User} {removed} {successfully}', 'type'=>5, 'timeout'=>0),
	'add user error'=>array('message'=>'Houve um erro para {add} o {user} ', 'type'=>1, 'timeout'=>0),
	'edit user error'=>array('message'=>'Houve um erro para {edit} o {user} ', 'type'=>1, 'timeout'=>0),
	'remove user error'=>array('message'=>'Houve um erro para {remove} o {user} ', 'type'=>1, 'timeout'=>0),
);
?>