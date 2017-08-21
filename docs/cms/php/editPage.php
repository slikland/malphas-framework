<?php
$data = json_decode(file_get_contents('php://input'), TRUE);

if(isset($data['page']) && !empty($data['page']) && isset($data['content']))
{
	file_put_contents('../data/pages/' . $data['page'] . '.html', $data['content']);
}
