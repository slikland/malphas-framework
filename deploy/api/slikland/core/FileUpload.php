<?php
namespace slikland\core;
class FileUpload
{
	function mkdir($path)
	{

	}

	static function uploadFile($file, $rootPath = DYNAMIC_IMAGE_PATH, $size = NULL, $imageName = NULL)
	{
		try{
			$fileInfo = pathinfo($file['name']);
			if(!$imageName)
			{
				$imageName = uniqid() . '.' . $fileInfo['extension'];
			}
			$imageSaved = FALSE;
			if(isset($size) && !empty($size))
			{
				list($width, $height) = getimagesize($file['tmp_name']);
				$w = $size[0];
				$h = $size[1];
				if($w != $width || $h != $height)
				{
					$imageName = uniqid() . '.jpg';
					$thumb = imagecreatetruecolor($w, $h);
					if($fileInfo && $fileInfo['extension'] == 'png')
					{
						imagesavealpha($thumb, true);
						$color = imagecolorallocatealpha($thumb, 0, 0, 0, 0); 
						imagefill($thumb, 0, 0, $color);
						$source = imagecreatefrompng($file['tmp_name']);
					}else
					{
						$source = imagecreatefromjpeg($file['tmp_name']);
					}

					$nw = $w;
					$nh = $h;
					$s = $nw / $nh;
					if($width / $height > $s)
					{
						$s = $h / $height;
					}else
					{
						$s = $w / $width;
					}

					$nw = $width * $s;
					$nh = $height * $s;

					imagecopyresampled($thumb, $source, ($w - $nw) >> 1, ($h - $nh) >> 1, 0, 0, $nw, $nh, $width, $height);
					imagejpeg($thumb, $rootPath . $imageName);
					$imageSaved = TRUE;
				}
			}
			if(!$imageSaved)
			{	
				move_uploaded_file($file['tmp_name'], $rootPath . $imageName);
			}
			return $imageName;
		}catch(Exception $e)
		{
			return NULL;
		}
	}

	function uploadTemplateImage($files, $data, $name, $template_id, $rootPath = DYNAMIC_IMAGE_PATH, $size = NULL, $imageName = NULL)
	{
		global $db;
		$image = NULL;
		if(isset($files[$name]) && $files[$name]['size'] > 0)
		{
			$image = FileUtils::uploadFile($files[$name], $rootPath, $size, $imageName);
		}else if(isset($data[$name . '_removed']) && $data[$name . '_removed'] == '1')
		{
			$image = NULL;
		}else if($template_id)
		{
			$image = $db->fetch_value("SELECT {$name} FROM answer_template WHERE pk_answer_template = {$template_id}");
		}

		return $image;
	}
}
?>