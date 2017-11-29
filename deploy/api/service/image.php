<?php
namespace service;

class image extends \service\upload
{
	function test()
	{
		$imageUploadModule = get_module('media/ImageUpload');
		// $imageUploadModule->
	}

	/**
	@permission
	*/
	function complete($data)
	{
		$uploadData = parent::complete($data);
		$imageUploadModule = get_module('media/ImageUpload');
		$imageData = $imageUploadModule->completeUpload($uploadData);
		return $imageData;
	}

	/**
	@permission
	*/
	function getRaw($data)
	{
		$id = NULL;
		if(@$data['id'])
		{
			$id = $data['id'];
		}else if (@$data[0])
		{
			$id = $data[0];
		}
		if(!$id) throw new ServiceSerror('Image ID not provided.');

		$imageUploadModule = get_module('media/ImageUpload');
		return $imageUploadModule->getRaw($id);
	}

	/**
	@permission
	@validation
		type:
			Data.required
		name:
			Data.required
		description:
			Data.required
		size:
			Data.required
	*/
	function saveCrop($data)
	{
		$imageUploadModule = get_module('media/ImageUpload');
		$id = $imageUploadModule->saveCrop($data);
		return ['image'=>['id'=>$id]];

	}

	/**
	@permission
	@validation
		type:
			Data.required
	*/
	function getType($data)
	{
		$type = $data['type'];
		$imageUploadModule = get_module('media/ImageUpload');
		$response = $imageUploadModule->getType($type);
		$response['type'] = $type;
		return $response;
	}

	/**
	@permission
	@validation
		0:
			Data.required
	*/
	function get($data)
	{
		$id = $data[0];
		$imageUploadModule = get_module('media/ImageUpload');
		return $imageUploadModule->get($id);
	}

	/**
	@permission
	*/
	function updateThumbs()
	{
		$db = db();
		$imageUploadModule = get_module('media/ImageUpload');
		$imageModule = get_module('Image');
		$types = $imageUploadModule->types;

		foreach($types as $name=>$type)
		{
			if(!@$type['thumb']) continue;
			$items = $db->query('image', ['type'=>$name]);
			foreach($items as $item)
			{
				$path = $item['sizes'][0]['path'];
				$name = preg_replace('/(\.[^\.]+)$/', '_thumb$1', $path);

				$imageModule->resize(DYNAMIC_PATH . $path, $type['thumb']['width'], $type['thumb']['height'], TRUE, DYNAMIC_PATH . $name);
				$item['thumb'] = [
					'width'=>$type['thumb']['width'],
					'height'=>$type['thumb']['height'],
					'path'=>$name,
				];
				$id = $item['id'];
				unset($item['id']);
				var_dump($id);
				var_dump($db->update('image', ['id'=>$id], $item));
			}
		}
	}
}