<?php

global $dictionary;

$dictionary = array(
	'add' => 'adicionar',
	'edit' => 'editar',
	'update' => 'atualizar',
	'remove' => 'remover',
	'added' => 'adicionado',
	'edited' => 'editado',
	'updated' => 'atualizado',
	'removed' => 'removido',
	'success' => 'sucesso',
	'successfully' => 'com sucesso',
	'error' => 'erro',
	'user'=>'usuário'
);

function translate($text, $values = array())
{
	global $dictionary;
	global $translateValues;
	if(is_array($values))
	{
		$translateValues = array_merge($dictionary, $values);
	}else
	{
		$translateValues = $dictionary;
	}
	$text = preg_replace_callback('/(\{(.*?)\})/', '_translateReplace', $text);
	// preg_match_all('/\{(.*?)\}/')
	// foreach($values as $k=>$v)
	// {
	// 	$text = str_replace('{' . $k . '}', $v, $text);
	// }
	return $text;
}
function _translateReplace($match)
{
	global $translateValues;

	$name = $match[2];
	$lname = strtolower($name);
	if(isset($translateValues[$lname]))
	{
		$value = $translateValues[$lname];
		if(preg_match('/^[A-Z]/', $name))
		{
			$value = ucfirst($value);
		}
		return $value;
	}

	return $match[0];
}
?>