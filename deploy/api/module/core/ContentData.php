<?php
namespace module\core;

class ContentData extends slikland\core\pattern\Singleton
{
	public $config = NULL;
	private $dataPath = NULL;
	private $paths = NULL;
	private $cache = array();

	private function _init()
	{
		if($this->config) return;
		$this->dataPath = ROOT_PATH . 'data/';
		$path = $this->dataPath;
		if(Setting::get('use_cms_content'))
		{
			$path = DYNAMIC_PATH . 'data/';
		}
		$config = @json_decode(@file_get_contents($path . 'config.json'), TRUE);
		if(!$config) throw new ServiceError('Config JSON not found');

		$this->_parsePaths($config['paths']);

		$this->config = $config;
		$this->config = $this->replacePaths($config);
	}

	private function _parsePaths($paths)
	{
		$this->paths = $paths;
		foreach($paths as &$path)
		{
			while(preg_match('/{([^\{\}]+)}/', $path))
			{
				$path = preg_replace_callback('/{([^\{\}]+)}/', array($this, '_replacePath'), $path);
			}
		}
		$this->paths = $paths;
	}

	private function _replacePath($match)
	{
		if(@$this->paths[$match[1]])
		{
			return $this->paths[$match[1]];
		}
		if(@$this->config)
		{
			return $match[0];
		}
		return '';
	}

	function replacePaths($data)
	{
		$isJson = FALSE;
		if(!is_string($data)){
			$data = json_encode($data);
			$isJson = TRUE;
		}
		$data = preg_replace_callback('/{([^\{\}]+)}/', array($this, '_replacePath'), $data);
		if($isJson)
		{
			$data = json_decode($data, TRUE);
		}

		return $data;
	}

	function init()
	{
		$this->_init();
	}

	function get($path)
	{
		$data = NULL;
		$raw = $this->getRaw($path);
		if($raw)
		{
			$data = $this->replacePaths($raw);
		}
		return $data;
	}

	function getRaw($path)
	{
		$this->_init();
		$path = preg_replace('/\.json$/', '', $path);
		$path = preg_replace('/^\/*/', '', $path);
		$path = preg_replace('/^data\//', '', $path);
		$dataPath = $this->dataPath;
		if(file_exists(ROOT_PATH . 'data/' . $path . '.json'))
		{
			$dataPath = ROOT_PATH . 'data/';
		}else if(Setting::get('use_cms_content'))
		{
			if(file_exists(DYNAMIC_PATH . 'data/' . $path . '.json'))
			{
				$dataPath = DYNAMIC_PATH . 'data/';
			}
		}
		if(!file_exists($dataPath . $path . '.json')) throw new ServiceError('JSON doesn\'t exist');
		if(!isset($this->cache[$path]))
		{
			$data = @json_decode(@file_get_contents($dataPath . $path . '.json'), TRUE);
			$this->cache[$path] = $data;
		}
		return $this->cache[$path];
	}
}