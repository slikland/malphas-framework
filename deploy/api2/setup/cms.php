<?php
function create_cms_db()
{
	$sql = file_get_contents(API_PATH . 'setup/cms.sql');
	$db = \slikland\core\DB::getInstance();
	$results = $db->multi_query($sql);
	return count($results) > 0;
}
?>