<?php
namespace module\util;

class UploadHelper
{
	function commit($value, $path, $extension)
	{
		$uploadModule = get_module('net/Upload');
		$imageModule = get_module('Image');

		$content = NULL;
		$uploadedData = NULL;
		$fileName = TRUE;

		if($value)
		{
			if(preg_match('/\/\//', $value))
			{
				$content = TRUE;
			}else{
				$uploadedData = $uploadModule->get($value, FALSE);
				$fileName = $uploadedData['id'] . $extension;
				$content = \slikland\fs\File::move($uploadedData['files'][0], $path . $filePath);
				$uploadModule->remove($value);
			}
		}

		if($content)
		{
			return $filePath;
		}

		return FALSE;
	}

	function commitImage($value, $path, $extension = 'jpg')
	{
		$uploadModule = get_module('net/Upload');
		$imageModule = get_module('Image');

		$image = NULL;
		$uploadedData = NULL;
		$filePath = TRUE;

		if($value)
		{
			if(preg_match('/\/\//', $value))
			{
				$image = TRUE;
			}else{
				$uploadedData = $uploadModule->get($value, FALSE);
				$image = $imageModule->getImage($uploadedData['files'][0]);
				$uploadModule->remove($value);
			}
		}

		if($image && !is_bool($image) && @$uploadedData)
		{
			$filePath = $uploadedData['id'] . '.' . $extension;
			$imageModule->save($image, $path . $filePath);
		}

		if($image)
		{
			return $filePath;
		}

		return FALSE;
	}
}