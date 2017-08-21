<?php
require('file.php');
$data = json_decode(file_get_contents('php://input'), TRUE);

if(isset($data['raw']))
{
	file_put_contents('../data/nav.html', $data['raw']);
}


if(isset($data['pages']))
{
	$pageFiles = File::listDir('../data/pages/', 'html');
	$pages = array();
	foreach($pageFiles as $page)
	{
		$name = preg_replace('/^.*data\/pages\/*(.*?)\.html$/', '$1', $page);
		if($name == 'index') continue;
		$pages[$name] = file_get_contents($page);
		unlink($page);
	}

	foreach($data['pages'] as $page)
	{
		$content = '';
		if(isset($page['prev']))
		{
			if($pages[$page['prev']])
			{
				$content = $pages[$page['prev']];
			}
		}
		file_put_contents('../data/pages/' . $page['name'] . '.html', $content);
	}
}
