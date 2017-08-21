<?php
namespace slikland\db;
class Interface
{
	private var $_views = array();
	private var $_fields = array();

	private var $_joins = array();

	$table = 'user'


	function get($fields, $where)
	{
		array(
			array("name"=>"Keita"),
			array("name!"=> "Vini"),
			array("name>"=> "Vini"),
			array("name<"=> "Vini"),
		);
	}


}

user:
	views:
		default:
			name
			email
		full:
			name
			email
			age
			submissions*: fk_submission
	fields:
		name
		email
		fk_submission*: 
		address: ("cep + addres")


// ->get($fields, $filters, $sort)

// FILTERING
// age>: 20
// age!: 20
// age: (asd)