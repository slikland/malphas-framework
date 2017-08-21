<?php
namespace module\util;

class YoutubeUtils
{
	function getId($url)
	{
		$rules = [
			'/youtube.com\/.*?\?.*?v=([^\&\?\/\.]+)(?:.*?)$/',
			'/youtube.com\/.*?\?.*?v=([^\&\?\/\.]+)(?:.*?)$/',
			'/youtube.com\/(?:v|embed)\/([^\&\?\/\.]+)(?:.*?)$/',
			'/youtu\.be\/([^\&\?\/\.]+)(?:.*?)$/',
			'/ytimg.com\/yt\/favicon([^\&\?\/\.]+)(?:.*?)$/',
			'/ytimg.com\/vi\/([^\&\?\/\.]+)(?:.*?)$/',
			'/([^\&\?\/\.]+)/',
		];

		$id = NULL;
		foreach($rules as $rule)
		{
			if(preg_match($rule, $url, $match))
			{
				if(!empty($match[1]))
				{
					$id = $match[1];
					break;
				}
			}
		}

		return $id;
	}
}
