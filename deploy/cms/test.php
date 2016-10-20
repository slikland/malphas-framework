<?php

$fns = get_defined_functions();
foreach($fns['internal'] as $k=>$fn)
{
	$f = '__' . $k;
	eval('function ' . $f . '(){call_user_func_array("'.$fn.'", func_get_args());}');
	// print $f . ': ' . $fn . "\n";
}
$i = 0;
// foreach($fns as $fn)
// {
// 	var_dump($fn);
// 	// $f = 'function '
// 	break;	
// }

// for()

// // var_dump(get_defined_functions());
// $b = 'var_dump';
// $a = $b;

// // eval('\x61')
// print $a;
// // print \x61;
__856();
function _(){

}