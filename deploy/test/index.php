<?php

/**
* Estimates whether a number is odd or even
*
* @method odd_or_even
* @param num {number} String to fix
* @return {Boolean} Returns True on even number, False on odd
*/
function odd_or_even($num)
{
return ($num%2); // Returns 0 for odd and 1 for even
}