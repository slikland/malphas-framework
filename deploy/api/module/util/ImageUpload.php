<?php
namespace module\util;

class ImageUpload
{
	function commit($value, $path)
	{
		$dataModule = get_module('vw/Data');
		$uploadModule = get_module('net/Upload');
		$imageModule = get_module('Image');

		$image = NULL;

		if($value)
		{
			if(preg_match('/\/\//', $value))
			{
				$image = TRUE;
			}else{
				$uploadedData = $uploadModule->get($value, FALSE);
				$image = $imageModule->getImage($uploadedData['files'][0]);
			}
		}

		if($image && !is_bool($image))
		{
			$imageModule->save($image, $path);
		}

		if($image)
		{
			return $path;
		}

		return FALSE;
	}
}