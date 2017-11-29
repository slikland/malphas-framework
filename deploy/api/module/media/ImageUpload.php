<?php

namespace module\media;

class ImageUpload extends \slikland\core\pattern\Singleton
{

	const RAW_PATH = 'images/raw/';

	function __construct()
	{
		@include_once('config/imageUpload.php');
		$this->types = $imageUploadSetting;
	}

	function completeUpload($uploadData)
	{
		$uploadModule = get_module('net/Upload');
		$imageModule = get_module('Image');

		$uploadedData = $uploadModule->get($uploadData['id'], FALSE);

		$file = $uploadedData['files'][0];
		$ext = $imageModule->getExtension($file);
		$error = NULL;
		$s3Module = get_module('net/S3');

		if($ext)
		{
			try{
				$mime = $imageModule->getMime($file);
				$image = $imageModule->getImage($uploadedData['files'][0]);
				$size = $imageModule->getSize($image);
				$name = $uploadedData['id'] . '.' . $ext;
				\slikland\fs\File::mkdir(DYNAMIC_PATH . self::RAW_PATH);

				$imageModule->save($image, DYNAMIC_PATH . self::RAW_PATH . $name);
				$uploadModule->remove($uploadData['id']);
				$db = db();
				$result = $db->insert('image_raw', 
					[
						'_id'=>$uploadData['id'],
						'path'=>self::RAW_PATH . $name,
						'ext'=>$ext,
						'mime'=>$mime,
						'width'=>$size[0],
						'height'=>$size[1],
					]
				);

				if($s3Module->active())
				{
					$s3Module->upload(DYNAMIC_PATH . self::RAW_PATH . $name, self::RAW_PATH . $name, FALSE);
					@unlink(DYNAMIC_PATH . self::RAW_PATH . $name);
				}


			}
			catch(\Exception $e)
			{
				$error = TRUE;
			}
		}else
		{
			$error = TRUE;
		}

		if($error)
		{
			throw new ServiceError("Arquivo com formato de imagem não reconhecido");
		}else
		{
			return $this->getRaw($uploadData['id']);
		}

	}

	function saveCrop($data)
	{
		$db = db();


		$type = $data['type'];
		$typeData = $this->getType($type);
		if(!$typeData) throw new ServiceError('Tipo de imagem não encontrado.');

		$imageModule = get_module('Image');
		$s3Module = get_module('net/S3');
		$inStorage = FALSE;

		$ext = @$typeData['ext'];

		$imageData = [];
		$imageData['name'] = trim($data['name']);
		$imageData['slug'] = \slikland\utils\StringUtils::slugify(trim($data['name']));
		$imageData['description'] = trim($data['description']);
		if(@$data['title'])
		{
			$imageData['title'] = trim($data['title']);
		}
		if(@$data['content'])
		{
			$imageData['content'] = trim($data['content']);
		}
		$imageData['type'] = $type;
		$imageData['sizes'] = [];
		if(!empty(@$data['id']))
		{
			$id = $data['id'];
		}else
		{
			$id = $db->uid();
		}
		
		$typeSizes = [];
		foreach($typeData['sizes'] as $size)
		{
			$typeSizes[$size['name']] = $size;
		}

		$sizes = $data['size'];
		if(is_string($sizes)) $sizes = json_decode($sizes, TRUE);

		$defaultRaw = NULL;
		if(isAssoc($sizes)) $sizes = [$sizes];
		foreach($sizes as $size)
		{
			if(is_string($size)) $size = json_decode($size, TRUE);
			$sizeData = [];
			$sizeType = @$typeSizes[$size['name']];
			if(!$sizeType) continue;
			$raw = $this->getRaw($size['id']);
			if(!$defaultRaw && $raw)
			{
				$defaultRaw = $raw;
			}
			if(!$raw) $raw = $defaultRaw;

			$nameSlug = \slikland\utils\StringUtils::slugify($size['name']);
			$sizeExt = $ext;

			if(!$sizeExt)
			{
				if(file_exists(ROOT_PATH . $raw['path']))
				{
					$sizeExt = $imageModule->getExtension(ROOT_PATH . $raw['path']);
				}else if(file_exists(DYNAMIC_PATH . $raw['path']))
				{
					$sizeExt = $imageModule->getExtension(DYNAMIC_PATH . $raw['path']);
				}else
				{
					$sizeExt = $imageModule->getExtension($raw['path']);
				}
			}

			$path = $typeData['path'] . $id . '-' . $nameSlug . '.' . $sizeExt;
			$this->crop(
				$raw['path'], 
				$size['crop'], 
				[$sizeType['width'], $sizeType['height']], 
				DYNAMIC_PATH . $path
			);

			if($s3Module->upload(DYNAMIC_PATH . $path, $path))
			{
				$inStorage = TRUE;
				// @unlink(DYNAMIC_PATH . $path);
			}

			$sizeData['name'] = @$size['name'];
			if(@$size['id'])
			{
				$sizeData['raw'] = @$size['id'];
			}else{
				$sizeData['raw'] = $defaultRaw['id'];
			}
			$sizeData['crop'] = @$size['crop'];
			$sizeData['width'] = @$sizeType['width'];
			$sizeData['height'] = @$sizeType['height'];
			$sizeData['path'] = $path;
			$sizeData['synced'] = 0;
			$sizeData['updated'] = timestamp();
			$imageData['sizes'][] = $sizeData;
		}

		if(@$typeData['thumb'] && @$imageData['sizes'][0])
		{
			$path = $imageData['sizes'][0]['path'];
			$name = preg_replace('/(\.[^\.]+)$/', '_thumb$1', $path);
			$url = DYNAMIC_PATH;
			if($s3Module->active())
			{
				$url = $s3Module->url();
			}

			$imageModule->resize(DYNAMIC_PATH . $path, $typeData['thumb']['width'], $typeData['thumb']['height'], TRUE, DYNAMIC_PATH . $name);

			$s3Module->upload(DYNAMIC_PATH . $name, $name);
			$imageData['thumb'] = [
				'width'=>$typeData['thumb']['width'],
				'height'=>$typeData['thumb']['height'],
				'path'=>$name,
			];
			@unlink(DYNAMIC_PATH . $name);
		}

		$imageData['id'] = $id;
		$imageData['inStorage'] = $inStorage;

		$db->update('image', ['_id'=>$imageData['id']], $imageData, ['upsert'=>true]);
		return $id;
	}

	function crop($source, $crop, $outputSize, $path = NULL)
	{
		$imageModule = get_module('Image');
		return $imageModule->crop($source, $crop, $outputSize, $path);
	}

	function getType($type)
	{
		$typeData = @$this->types[$type];
		if($typeData && !@$typeData['ext']) $typeData['ext'] = 'png';
		return $typeData;
	}

	function getRaw($id, $fullURL = TRUE)
	{
		$db = db();
		$options = [];



		if($fullURL)
		{
			$s3Module = get_module('net/S3');
			if($s3Module->active())
			{
				$url = $s3Module->url();
			}else{
				$url = DYNAMIC_URL;
			}
		}else{
			$url = \slikland\fs\File::toRelative(DYNAMIC_URL);
		}
		$options = [
			'$addFields'=>[
				'path'=>[
					'$concat'=>[
						$url,
						'$path',
					]
				]
			]
		];
		$imageData = $db->get('image_raw', ['id'=>$id], $options);
		return $imageData;

	}

	function getAll($type)
	{
		
	}

	function paginateImages($data)
	{

	}

	function get($id)
	{
		$db = db();
		$aggregate = [];
		$aggregate[] = ['$unwind'=>'$sizes'];
		$aggregate[] = [
			'$lookup'=>[
				'from'=>'image_raw',
				'localField'=>'sizes.raw',
				'foreignField'=>'_id',
				'as'=>'sizes.raw',
			]
		];
		$aggregate[] = ['$unwind'=>['path'=>'$sizes.raw', 'preserveNullAndEmptyArrays'=>TRUE]];
		$aggregate[] = [
			'$group'=>[
				'_id'=>'$_id',
				'name'=>['$first'=>'$name'],
				'slug'=>['$first'=>'$slug'],
				'title'=>['$first'=>'$title'],
				'content'=>['$first'=>'$content'],
				'description'=>['$first'=>'$description'],
				'type'=>['$first'=>'$type'],
				's_name'=>['$first'=>'$s_name'],
				'sizes'=>['$push'=>'$sizes'],
				'thumb'=>['$first'=>'$thumb'],
			]
		];

		$item = $db->query('image', ['id'=>$id], [], $aggregate);

		$s3Module = get_module('net/S3');
		$rootURL = DYNAMIC_URL;
		if($s3Module->active())
		{
			$rootURL = $s3Module->url();
		}

		if(!empty($item)){
			$item = $item[0];
			foreach($item['sizes'] as $k=>$v)
			{
				$item['sizes'][$k]['path'] = $rootURL . @$item['sizes'][$k]['path'];
				if(@$item['sizes'][$k]['raw']['path'])
				{
					$item['sizes'][$k]['raw']['path'] = $rootURL . @$item['sizes'][$k]['raw']['path'];
				}
			}
			if(@$item['thumb'])
			{
				$item['thumb']['path'] = $rootURL . $item['thumb']['path'];
			}
		}else
		{
			$item = NULL;
		}
		return $item;
	}

	function getParsed($id)
	{
		$item = $this->get($id);
		$response = NULL;
		if($item)
		{
			if(@$item['sizes'])
			{
				$sizes = array_reverse($item['sizes']);
				$i = count($sizes) - 1;
				if($i > 0)
				{
					$response = [];
				}
				foreach($sizes as $k => $size)
				{
					$sizeData = ['file'=>$size['path']];
					if(!in_array($size['name'], ['desktop', 'mobile'])) continue;
					if($i != $k)
					{
						$sizeData['condition'] = $size['name'];
					}
					$response[] = $sizeData;
				}
			}
		}

		return $response;
	}

	function getThumb($id)
	{
		$item = $this->get($id);
		$response = NULL;
		if($item)
		{
			if(@$item['thumb'])
			{
				$response = [];
				$response[] = ['file'=>$item['thumb']['path']];
			}
		}

		return $response;
	}

}