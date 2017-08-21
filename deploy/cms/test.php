<?php

function test()
{
	$a = 1;
	print 1;
	test2();
}

function test2()
{

	print 2;
	print $a;
}

test();