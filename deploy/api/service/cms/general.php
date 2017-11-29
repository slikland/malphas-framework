<?php
namespace service\cms;

class general
{

	/**
	@permission
	*/
	function getHeader($data)
	{
		$generalModule = get_module('ford/General');
		return $generalModule->getHeader($data);
	}

	/**
	@permission
	*/
	function setHeader($data)
	{
		$generalModule = get_module('ford/General');
		$response = $generalModule->setHeader($data);
		if($response)
		{
			return ['notification'=>['message'=>'Dados alterados com sucesso.', 'type'=>5]];
		}else{
			throw new ServiceError('Ocorreu algum erro ao salvar, tente novamente.');
		}
	}

	/**
	@permission
	*/
	function getFooter($data)
	{
		$generalModule = get_module('ford/General');
		$footerData = $generalModule->getFooter($data);

		$socialAssets = $generalModule->getSocialAssets();
		if(!@$footerData['social']) $footerData['social'] = [];
		$social = [];
		foreach($footerData['social'] as $item)
		{
			if(!@$item['title']) continue;
			$social[$item['title']] = $item;
		}

		$socialItems = [];
		foreach($socialAssets as $k=>$v)
		{
			if(@$social[$k])
			{
				$social[$k]['icon'] = @$v['icon'];
				$socialItems[] = $social[$k];
			}else{
				$socialItems[] = [
					'title'=>$k,
					'icon'=>@$v['icon'],
					'url'=>'',
				];
			}
		}

		$footerData['social'] = $socialItems;


		return $footerData;
	}

	/**
	@permission
	*/
	function setFooter($data)
	{
		$generalModule = get_module('ford/General');
		$response = $generalModule->setFooter($data);
		if($response)
		{
			return ['notification'=>['message'=>'Dados alterados com sucesso.', 'type'=>5]];
		}else{
			throw new ServiceError('Ocorreu algum erro ao salvar, tente novamente.');
		}
	}

	function getMeta()
	{
		$generalModule = get_module('ford/General');
		return $generalModule->getMeta();
	}

	function setMeta($data)
	{
		$generalModule = get_module('ford/General');
		return $generalModule->setMeta($data);
	}

}