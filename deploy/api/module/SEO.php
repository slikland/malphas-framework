<?php
namespace module;
include_once('slikland/utils/Html.php');
class SEO extends \slikland\core\pattern\Singleton
{
	function __construct($parse = FALSE)
	{
		$this->paths = NULL;
		$this->_isBot = NULL;
		$this->_isSocialBot = NULL;
		$this->contentModule = get_module('core/ContentData');
		$this->contentModule->init();
	}

	private function parseURL($url)
	{
		$href = $url;
		$target = '_blank';
		if(!preg_match('/^(https?)\:?\/\//', $href))
		{
			$href = ROOT_URL . preg_replace('/^\/+/', '', $href);
			$target = '_self';
		}

		return array('url'=>$href, 'target'=>$target);
	}

	function parse()
	{
		preg_match('/^(.*?)(\?.*?)?$/', REQUEST_URI, $uriMatch);
		$uri = ltrim($uriMatch[1], '/');
		$this->uri = $uri;

		if($this->isBot())
		{
			if(strtolower($uri) == 'robots.txt')
			{
				header('Content-type: text/plain');
				print $this->getRobots();
				die();
			}else if(strtolower($uri) == 'sitemap.xml')
			{
				header('Content-type: application/xml');
				print $this->getSitemap();
				die();
			}
		}

		$configJson = $this->contentModule->get('config');
		$mainJson = $this->contentModule->get('main');

		$assets = array();
		if($mainJson['assets'])
		{
			foreach(@$mainJson['assets'] as $asset)
			{
				$src = $asset['src'];
				if(!preg_match('/^(https?:?)?\/\//', $src))
				{
					$src = ROOT_URL . preg_replace('/^\/+/', '', $src);
				}
				$assets[$asset['id']] = $src;
			}
		}

		$this->data = array(
			'config'=>$configJson,
			'main'=>$mainJson,
			'assets'=>$assets,
		);

		$matchedViews = array();
		$defaultView = NULL;
		$defaultViewCount = 10000000;
		$views = array();

		foreach($configJson['views'] as &$view)
		{
			if(@$view['route'])
			{
				$route = $view['route'];
				$clean = $route;
				$clean = preg_replace('/\(.*?\)/', '', $clean);
				$clean = preg_replace('/\{.*?\}/', '', $clean);
				$clean = preg_replace('/^\/+/', '', $clean);
				$clean = preg_replace('/\/+$/', '', $clean);
				$clean = preg_replace('/\?$/', '', $clean);
				$clean .= '/';
				$route = preg_replace('/^\/+/', '', $route);
				$route = preg_replace('/\/+$/', '', $route);
				$slashes = count(explode('/', $route));
				$route = preg_replace('/\(/', '(?:', $route);
				preg_match_all('/\{(.*?)\}/', $route, $routeVars);
				$routeVars = @$routeVars[1];
				$route = preg_replace('/\{.*?\}/', '(.*?)', $route);
				$route = preg_replace('/\//', '\\/', $route);
				$route = '/^\/?' . $route . '$/';
				$routeData = array(
					'route'=>$route,
					'clean'=>$clean,
					'vars'=>$routeVars,
					'numSlashes'=>$slashes,
				);
				$viewData = array('view'=>$view, 'matches'=>array(), 'routeData'=>$routeData);

				try{
					$content = @$this->contentModule->get(@$view['content']);
				}catch(\Exception $e)
				{
					$content = array();
				}
				$viewData['content'] = $content;
				if($slashes < $defaultViewCount)
				{
					$defaultView = $viewData;
					$defaultViewCount = $slashes;
				}
				if((bool)preg_match($route, $uri, $matches))
				{
					$viewData['routeData']['matches'] = $matches;
					$matchedViews[] = $viewData;
				}
				$views[$view['id']] = $viewData;
			}
		}

		$this->views = $views;

		usort($matchedViews, array($this, '_sortRouteMatches'));
		$matchedView = NULL;
		foreach($matchedViews as $view)
		{
			$viewId = @$view['view']['id'];
			if(!$viewId) continue;
			$viewId = preg_replace('/\-/', '', $viewId);
			$view['viewId'] = $viewId;
			if(!method_exists($this, '_validate_route_' . $viewId) || call_user_func_array(array($this, '_validate_route_' . $viewId), array(&$view)))
			{
				$matchedView = $view;
				break;
			}
		}
		if(!$matchedView)
		{
			$matchedView = $defaultView;
		}
		$this->currentView = $matchedView;
		$this->content = $this->currentView['content'];
	}

	private function _sortRouteMatches($a, $b)
	{
		$a = $a['routeData']['numSlashes'];
		$b = $b['routeData']['numSlashes'];
		if($a > $b) return -1;
		if($a < $b) return 1;
		return 0;
	}

	function generateSitemap()
	{
		$urls = array();
		$used = array();
		$urls[] = array('url'=>ROOT_URL, 'priority'=>'1', 'frequency'=>'daily');

		$db = db();
		$urls += $db->fetch_all('SELECT CONCAT(?, q.text) url, "weekly" frequency, (q.favorite * 0.4 + 0.2) priority FROM query q LEFT JOIN animation a ON a.pk_animation = q.fk_animation LEFT JOIN animation_type at ON at.pk_animation_type = a.fk_animation_type WHERE a.status = 1 AND q.status = 1 AND at.type != "not_found" AND suggest = 1;', array(ROOT_URL));

		$sitemap = new Html('', '<?xml version="1.0" encoding="utf-8"?>');
		$urlset = new Html('urlset', '', array('xmlns'=>'http://www.sitemaps.org/schemas/sitemap/0.9', 'xmlns:xsi'=>'http://www.w3.org/2001/XMLSchema-instance', 'xsi:schemaLocation'=>'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd'));
		foreach($urls as $url)
		{
			$u = new Html($urlset, 'url');
			new Html($u, 'loc', $url['url']);
			new Html($u, 'changefreq', $url['frequency']);
			new Html($u, 'priority', $url['priority']);
		}

		$sitemap = '<?xml version="1.0" encoding="utf-8"?>' . $urlset->render(TRUE);
		Setting::set('sitemap', $sitemap);
		return $sitemap;
	}

	function isBot()
	{
		if(!is_null($this->_isBot))
		{
			return $this->_isBot;
		}
		$bots = '/Google \(\+|facebookexternalhit|facebookscraper|1PasswordThumbs|Add Catalog|AdsBot-Google|AdsBot-Google-Mobile|aiHitBot|aiHitBot-BP|AppEngine-Google|Arora|Ask Jeeves|Baiduspider|Baiduspider+|bingbot|Bloglines|Butterfly|CJNetworkQuality|crawler|CSSCheck|DCPbot|Download Demon|EmailWolf|everyfeed-spider|Exabot|FAST-WebCrawler|FeedFetcher-Google|Gaisbot|Google-|Googlebot|Googlebot-|GoogleToolbar|Gregarius|grub-client|grub-client-|Gulper Web Bot|HTMLParser|ia_archiver|iTunes|Java|Jigsaw|libwww-perl|Mediapartners-Google|Microsoft URL Control|MJ12bot|msnbot|msnbot-media|muncher|Nessus|Netcraft Web Server Survey|NetcraftSurveyAgent|NetPositive|Offline Explorer|P3P Validator|PaperLiBot|Peach|Python-urllib|QupZilla|robot|SeaMonkey|SearchExpress|SmartLinksAddon|StatusNet|SuperBot|Teoma|Twitterbot|TweetmemeBot|Untiny|UnwindFetchor|W3C_Validator|WDG_Validator|Web Downloader|WebCopier|WebZIP|Wget|Slurp|YahooCacheSystem|YandexBot|YandexImages|Yandex|Yeti|seznambot|Naverbot|sitemap/i';
		if(!@$_SERVER['HTTP_USER_AGENT'])
		{
			$isBot = TRUE;
		}else{
			$isBot = (bool) preg_match($bots, $_SERVER['HTTP_USER_AGENT']);
		}
		$this->_isBot = $isBot;
		return $isBot;
	}

	function isSocialBot()
	{
		if(!is_null($this->_isSocialBot))
		{
			return $this->_isSocialBot;
		}
		$fbBots = '/(facebookexternalhit|facebookscraper|Twitterbot|)/i';
		$isFBBot = (bool) preg_match($fbBots, $_SERVER['HTTP_USER_AGENT']);
		$this->_isSocialBot = $isFBBot;
		return $isFBBot;
	}

	function printMeta()
	{
		$header = new Html('');

		$metaModule = get_module('Meta');
		$meta = $metaModule->getMeta(REQUEST_URI);

		$canonical = ROOT_URL . $this->uri;
		
		new Html($header, 'link', NULL, array('rel'=>'canonical', 'href'=>$canonical));

		if(@$meta['title']) new Html($header, 'title', htmlentities($meta['title']));
		if(@$meta['description']) new Html($header, 'meta', NULL, array('name'=>'description', 'content'=>htmlentities($meta['description'])));
		if(@$meta['keywords']) new Html($header, 'meta', NULL, array('name'=>'keywords', 'content'=>htmlentities($meta['keywords'])));
		
		new Html($header, 'meta', NULL, array('property'=>'og:url', 'content'=>$canonical));
		new Html($header, 'meta', NULL, array('property'=>'og:type', 'content'=>'website'));
		if(@$meta['facebook_title']) new Html($header, 'meta', NULL, array('property'=>'og:title', 'content'=>htmlentities($meta['facebook_title'])));
		if(@$meta['facebook_description']) new Html($header, 'meta', NULL, array('property'=>'og:description', 'content'=>htmlentities($meta['facebook_description'])));
		if(@$meta['facebook_image']['url'])
		{
			if(file_exists($meta['facebook_image']['absolute_path']))
			{
				$size = @getimagesize(file_exists($meta['facebook_image']['absolute_path']));
				if(!$size) $size = array('1200', '600');
				new Html($header, 'meta', NULL, array('property'=>'og:image', 'content'=>$meta['facebook_image']['url']));
				new Html($header, 'meta', NULL, array('property'=>'og:image:url', 'content'=>$meta['facebook_image']['url']));
				new Html($header, 'meta', NULL, array('property'=>'og:image:width', 'content'=>$size[0]));
				new Html($header, 'meta', NULL, array('property'=>'og:image:height', 'content'=>$size[1]));
			}
		}

		if(@$meta['twitter_title']) new Html($header, 'meta', NULL, array('name'=>'twitter:title', 'content'=>htmlentities($meta['twitter_title'])));
		if(@$meta['twitter_description']) new Html($header, 'meta', NULL, array('name'=>'twitter:description', 'content'=>htmlentities($meta['twitter_description'])));
		if(@$meta['twitter_image']['url'])
		{
			if(file_exists($meta['twitter_image']['absolute_path']))
			{
				new Html($header, 'meta', NULL, array('name'=>'twitter:image', 'content'=>$meta['twitter_image']['url']));
				new Html($header, 'meta', NULL, array('name'=>'twitter:card', 'content'=>'summary_large_image'));
			}
		}

		$header->render();
	}

	function printHeader()
	{
		$html = new Html('header');
		$nav = new Html($html, 'nav', NULL);

		$menuData = @$this->data['main']['menu'];
		if($menuData)
		{
			if(@$menuData['logo']) new Html($nav, 'img', NULL, array('src'=>ROOT_URL . @$menuData['logo']['src']));
			if(@$menuData['backgroundMenu']) $nav->attr('style','background-image: url('.ROOT_URL . @$menuData['backgroundMenu']['src'].');');
			if(@$menuData['links'])
			{
				$ul = new Html($nav, 'ul');
				foreach($menuData['links'] as $link)
				{
					$li = new Html($ul, 'li');
					$href = $this->parseURL($link['link']);
					new Html($li, 'a', $link['label'], array('href'=>$href['url'], 'target'=>$href['target']));
				}
			}
		}

		return $html->render();
	}

	function printContent()
	{
		$html = new Html('');
		if(method_exists($this, '_content_' . @$this->currentView['viewId']))
		{
			call_user_func_array(array($this, '_content_' . @$this->currentView['viewId']), array($html, $this->currentView, $this->content));
		}

		return $html->render();
	}

	function printFooter()
	{
		$html = new Html('footer');

		$footer = @$this->data['main']['footer'];
		if(($data = @$footer['bottom']))
		{
			if(@$data['links'])
			{
				$ul = new Html($html, 'ul');
				foreach($data['links'] as $link)
				{
					$li = new Html($ul, 'li');
					if(@$link['link'] && trim(strlen($link['link'])) > 0)
					{
						$href = $this->parseURL($link['link']);
						new Html($li, 'a', $link['label'], array('href'=>$href['url'], 'target'=>$href['target']));
					}else
					{
						$li->content($link['label']);
					}
				}
			}

			if(@$data['socials'])
			{
				$div = new Html($html, 'div');
				if($data['socials']['caption']) new Html($div, 'h3', $data['socials']['caption']);
				$ul = new Html($div, 'ul');
				foreach($data['socials']['buttons'] as $link)
				{
					$li = new Html($ul, 'li');
					$href = $this->parseURL($link['link']);
					$a = new Html($li, 'a', @$link['label'], array('href'=>$href['url'], 'target'=>$href['target']));
					if(@$link['iconId'])
					{
						new Html($a, 'img', NULL, array('src'=>@$this->data['assets'][$link['iconId']], 'style'=>'max-width: 1em; max-height: 1em;'));
					}
				}
			}
		}

		return $html->render();
	}

	function setRobots($data)
	{
		$data = trim(preg_replace('/\r/', '', $data)) . "\n";
		Setting::set('robots.txt', $data);
	}

	function getRobots()
	{
		return Setting::get('robots.txt');
	}

	function getSitemap()
	{
		return Setting::get('sitemap');
	}

	private function _content_intro($html, $viewData, $content)
	{
		$html = new Html($html, 'section');

		if(($words = implode(', ', @$content['words']))) new Html($html, 'h3', $words);

		new Html($html, 'h1', '0109');
		if(@$content['logoLabel']) new Html($html, 'h2', $content['logoLabel']);


	}

	private function _validate_route_episodes(&$view)
	{
		$content = @$view['content'];
		$matched = FALSE;
		if(@$view['routeData']['matches'][1])
		{
			$episodeId = $view['routeData']['matches'][1];
			$matchedEpisode = NULL;
			if(@$content['episodes'])
			{
				foreach($content['episodes'] as $episode)
				{
					if($episode['episodeId'] == $episodeId)
					{
						$matchedEpisode = $episode;
						break;
					}
				}
			}
			$view['episode'] = $matchedEpisode;
			if($matchedEpisode)
			{
				$matched = TRUE;
			}
		}else{
			$matched = TRUE;
		}
		return $matched;
	}

	private function _content_episodes($html, $viewData, $content)
	{
		$html = new Html($html, 'section');

		if(@$viewData['episode'])
		{
			$episode = $viewData['episode'];
			if(@$episode['episodeNumber']) new Html($html, 'h2', $episode['episodeNumber']);
			if(@$episode['title']) new Html($html, 'h1', $episode['title']);
			if(@$episode['sinopse']) new Html($html, 'p', $episode['sinopse']);
			if(@$episode['sinopseButton'])
			{
				new Html($html, 'a', $episode['sinopseButton'], array('href' => ROOT_URL . $this->uri . '/sinopse'));
			}
			if(@$episode['poster']){
				$srcs = $episode['poster']['src'];
				new Html($html, 'img', NULL, array('src'=>ROOT_URL . $srcs[count($srcs) - 1]['file']));
			}


		}else{
			if(@$content['episodes'])
			{
				$ul = new Html($html, 'ul', NULL);
				foreach($content['episodes'] as $episode)
				{
					$container = new Html($ul, 'li');
					if($episode['video']['src'])
					{
						$container = new Html($container, 'a', NULL, array('href'=>$viewData['routeData']['clean'] . $episode['episodeId']));
					}
					if(@$episode['episodeNumber']) new Html($container, 'span', $episode['episodeNumber']);
					if(@$episode['title']) new Html($container, 'b', $episode['title']);
				}
			}
		}


		if(@$content['links'])
		{
			$ul = new Html($html, 'ul', NULL);
			foreach($content['links'] as $link)
			{
				if(@$this->views[@$link['ref']])
				{
					$li = new Html($ul, 'li');
					if(@$link['image'])
					{
						$srcs = $link['image']['src'];
						$li->attr('style', 'background-image: url('.ROOT_URL . $srcs[count($srcs) - 1]['file'].')');
					}
					if(@$link['button'])
					{
						$href = $this->parseURL($link['button']['link']);
						$li = new Html($li, 'a', NULL, array('href'=>$href['url'], 'target'=>$href['target']));
					}
					if(@$link['title']) new Html($li, 'h2', $link['title']);

				}
			}
		}
	}
	private function _validate_route_episodedetail(&$view)
	{
		$content = @$view['content'];
		$matched = FALSE;
		if(@$view['routeData']['matches'][1])
		{
			$episodeId = $view['routeData']['matches'][1];
			$matchedEpisode = NULL;
			$episodes = @$this->views['episodes']['content']['episodes'];
			if($episodes)
			{
				foreach($episodes as $episode)
				{
					if($episode['episodeId'] == $episodeId)
					{
						$matchedEpisode = $episode;
						break;
					}
				}
			}
			$view['episode'] = $matchedEpisode;
			if($matchedEpisode)
			{
				$matched = TRUE;
			}
		}else{
			$matched = TRUE;
		}
		return $matched;
	}

	private function _content_episodedetail($html, $viewData, $content)
	{
		$html = new Html($html, 'section');

		if(@$viewData['episode'])
		{
			$episode = $viewData['episode'];
			if(@$episode['episodeNumber']) new Html($html, 'h2', $episode['episodeNumber']);
			if(@$episode['title']) new Html($html, 'h1', $episode['title']);
			switch(@$viewData['routeData']['matches'][2])
			{
				case 'video':
					if(@$episode['video']['youtube'])
					{
						new Html($html, 'iframe', NULL, array('src'=>'https://www.youtube.com/embed/' . $episode['video']['youtube'], 'width'=>'560', 'height'=>'315', 'frameborder'=>'0', 'allowfullscreen'=>''));
					}
					break;
				case 'sinopse':
					if(@$episode['poster']){
						$srcs = $episode['poster']['src'];
						new Html($html, 'img', NULL, array('src'=>ROOT_URL . $srcs[count($srcs) - 1]['file']));
					}
					if(@$content['sinopse'])
					{
						if(@$episode['video']['duration']) new Html($html, 'p', $content['sinopse']['durationLabel'] . ' ' . $episode['video']['duration']);
						new Html($html, 'h2', $content['sinopse']['title']);
						new Html($html, 'a', $content['sinopse']['watchButtonLabel'], array('href' => ROOT_URL . $viewData['routeData']['clean'] . $episode['episodeId'] . '/video'));
						if(@$episode['sinopse']) new Html($html, 'p', $episode['sinopse']);
					}
					if(@$episode['technology']['id'])
					{
						$technologies = @$this->views['technology']['content']['features'];
						$techId = $episode['technology']['id'];
						if($technologies)
						{
							$techData = NULL;
							foreach($technologies as $tech)
							{
								if($tech['id'] == $techId)
								{
									$techData = $tech;
									break;
								}
							}

							if($techData && @$content['sinopse']['technology'])
							{
								$div = new Html($html, 'div');
								new Html($div, 'h2', $content['sinopse']['technology']['title']);
								$description = $content['sinopse']['technology']['description'];
								$description = preg_replace('/\{techName\}/', $techData['title'], $description);
								new Html($div, 'p', $description);
								$route = ROOT_URL . $this->views['technology']['routeData']['clean'];
								new Html($div, 'a', $content['sinopse']['technology']['buttonLabel'], array('href'=>$route . $techData['id']));
							}
						}
						// if(@$episode['video']['duration']) new Html($html, 'p', $content['sinopse']['durationLabel'] . ' ' . $episode['video']['duration']);
						// new Html($html, 'h2', $content['sinopse']['title']);
						// new Html($html, 'a', $content['sinopse']['watchButtonLabel'], array('href' => ROOT_URL . $viewData['routeData']['clean'] . $episode['episodeId'] . '/video'));
					}
					break;
				default:
					break;

			}


		}else{
			if(@$content['episodes'])
			{
				$ul = new Html($html, 'ul', NULL);
				foreach($content['episodes'] as $episode)
				{
					$container = new Html($ul, 'li');
					if($episode['video']['src'])
					{
						$container = new Html($container, 'a', NULL, array('href'=>$viewData['routeData']['clean'] . $episode['episodeId']));
					}
					if(@$episode['episodeNumber']) new Html($container, 'span', $episode['episodeNumber']);
					if(@$episode['title']) new Html($container, 'b', $episode['title']);
				}
			}
		}


		if(@$content['links'])
		{
			$ul = new Html($html, 'ul', NULL);
			foreach($content['links'] as $link)
			{
				if(@$this->views[@$link['ref']])
				{
					$li = new Html($ul, 'li');
					if(@$link['image'])
					{
						$srcs = $link['image']['src'];
						$li->attr('style', 'background-image: url('.ROOT_URL . $srcs[count($srcs) - 1]['file'].')');
					}
					if(@$link['button'])
					{
						$href = $this->parseURL($link['button']['link']);
						$li = new Html($li, 'a', NULL, array('href'=>$href['url'], 'target'=>$href['target']));
					}
					if(@$link['title']) new Html($li, 'h2', $link['title']);

				}
			}
		}
	}

	private function _validate_route_about(&$view)
	{
		$content = @$view['content'];
		$matched = FALSE;
		if(@$view['routeData']['matches'][1])
		{
			$aboutDeeplink = trim($view['routeData']['matches'][1], '/');
			$childContent = NULL;
			foreach($content as $k=>$v)
			{
				if(@$v['route'] && trim(@$v['route'], '/') == $aboutDeeplink)
				{
					$childContent = $v;
					$childContent['id'] = $k;
					break;
				}
			}
			if($childContent)
			{
				$view['child'] = $childContent;
				$matched = TRUE;
			}
		}else{
			$matched = TRUE;
		}
		return $matched;
	}

	private function _content_about($html, $viewData, $content)
	{
		$html = new Html($html, 'section');

		if(@$viewData['child'])
		{
			$childContent = $viewData['child'];
			switch($childContent['id'])
			{
				case 'trailer':
					if(@$childContent['youtube'])
					{
						new Html($html, 'iframe', NULL, array('src'=>'https://www.youtube.com/embed/' . $childContent['youtube'], 'width'=>'560', 'height'=>'315', 'frameborder'=>'0', 'allowfullscreen'=>''));
					}
					break;
				case 'datasheet':
					if(@$childContent['title']) new Html($html, 'h1', $childContent['title']);
					if(@$childContent['description']) new Html($html, 'p', $childContent['description']);
					if(@$childContent['professionals'])
					{
						$dl = new Html($html, 'dl');
						foreach($childContent['professionals'] as $professional)
						{
							new Html($dl, 'dt', $professional['title']);
							new Html($dl, 'dd', $professional['name']);
						}
					}
					break;
				default:
					break;
			}
		}else{
			new Html($html, 'h1', @$content['subTitle'] . ' ' . $content['title']);
			new Html($html, 'p', @$content['description']);

			if(@$content['button']['label'] && @$content['trailer']['route']) new Html($html, 'a', $content['button']['label'], array('href'=>ROOT_URL . $viewData['routeData']['clean'] . trim($content['trailer']['route'], '/')));


			if(($data = @$content['datasheet'])){
				$div = new Html($html, 'div');
				new Html($div, 'h2', $data['title']);
				new Html($div, 'a', $data['description'], array('href'=>ROOT_URL . $viewData['routeData']['clean'] . trim($content['datasheet']['route'], '/')));
			}

		}
	}	

	private function _validate_route_characters(&$view)
	{
		$content = @$view['content'];
		$matched = FALSE;
		if(@$view['routeData']['matches'][1])
		{
			$id = trim($view['routeData']['matches'][1], '/');
			$childContent = NULL;
			foreach($content['characters'] as $k=>$v)
			{
				if(@$v['id'] == $id)
				{
					$childContent = $v;
					break;
				}
			}
			if($childContent)
			{
				$view['child'] = $childContent;
				$matched = TRUE;
			}
		}else{
			$matched = TRUE;
		}
		return $matched;
	}

	private function _content_characters($html, $viewData, $content)
	{
		$html = new Html($html, 'section');

		if(@$viewData['child'])
		{
			$childContent = $viewData['child'];
			if(@$content['glossary']['characterLabel']) new Html($html, 'b', $content['glossary']['characterLabel']);
			if(@$childContent['name']) new Html($html, 'h2', $childContent['name']);
			if(@$childContent['description']) new Html($html, 'p', $childContent['description']);
			if(@$childContent['quote'])
			{
				$quote = new Html($html, 'bloquote', $childContent['quote']['description']);
				if(@$childContent['quote']['episode']) new Html($quote, 'cite', $childContent['quote']['episode']);
			}
			if(@$childContent['image']['src'])
			{
				$srcs = $childContent['image']['src'];
				new Html($html, 'img', NULL, array('src'=>ROOT_URL . $srcs[count($srcs) - 1]['file']));
			}

		}else{

			$ul = new Html($html, 'ul');
			foreach ($content['characters'] as $character) {
				$li = new Html($ul, 'li');
				new Html($li, 'a', $character['name'], array('href'=>ROOT_URL . $viewData['routeData']['clean'] . $character['id']));
			}

		}
	}	

	private function _validate_route_technology(&$view)
	{
		$content = @$view['content'];
		$matched = FALSE;
		if(@$view['routeData']['matches'][1])
		{
			$id = trim($view['routeData']['matches'][1], '/');
			$childContent = NULL;
			foreach($content['features'] as $k=>$v)
			{
				if(@$v['id'] == $id)
				{
					$childContent = $v;
					break;
				}
			}
			if($childContent)
			{
				$view['child'] = $childContent;
				$matched = TRUE;
			}
		}else{
			$matched = TRUE;
		}
		return $matched;
	}

	private function _content_technology($html, $viewData, $content)
	{
		$html = new Html($html, 'section');

		if(@$viewData['child'])
		{
			$childContent = $viewData['child'];

			if(@$childContent['subTitle'])new Html($html, 'b', $childContent['subTitle']);
			if(@$childContent['title'])new Html($html, 'h1', $childContent['title']);
			if(@$childContent['description'])new Html($html, 'p', $childContent['description']);
			if(@$childContent['gallery'])
			{
				$dl = new Html($html, 'dl');
				new Html($dl, 'dt', 'Galeria');
				foreach($childContent['gallery'] as $item) {
					$dd = new Html($dl, 'dd');
					$srcs = $item['src'];
					new Html($dd, 'img', NULL, array('src'=>ROOT_URL . $srcs[count($srcs) - 1]['file']));
				}
			}
		}else{

			if(@$content['highlight']['subTitle'])new Html($html, 'b', $content['highlight']['subTitle']);
			if(@$content['highlight']['title'])new Html($html, 'h1', $content['highlight']['title']);
			if(@$content['highlight']['description'])new Html($html, 'p', $content['highlight']['description']);
			$ul = new Html($html, 'ul');
			foreach ($content['features'] as $feature) {
				$li = new Html($ul, 'li');
				$a = new Html($li, 'a', $feature['subTitle'] . ' ', array('href'=>ROOT_URL . $viewData['routeData']['clean'] . $feature['id']));
				new Html($a, 'b', $feature['title']);
			}

		}
	}	

	private function _content_makingof($html, $viewData, $content)
	{
		$html = new Html($html, 'section');

		$dl = new Html($html, 'dl');
		if($content['gallery'])
		{
			foreach($content['gallery'] as $item)
			{
				$media = $item['media'];
				if(@$item['type'] == 'video')
				{
					if(@$item['buttonLabel']) $dt = new Html($dl, 'dt', $item['buttonLabel']);
					$dd = new Html($dl, 'dd');
					if(@$item['media']['youtube']) new Html($dd, 'iframe', NULL, array('src'=>'https://www.youtube.com/embed/' . $item['media']['youtube'], 'width'=>'560', 'height'=>'315', 'frameborder'=>'0', 'allowfullscreen'=>''));
				}else{
					if(@$media['src'])
					{
						$dd = new Html($dl, 'dd');
						$srcs = $media['src'];
						new Html($dd, 'img', NULL, array('src'=>ROOT_URL . $srcs[count($srcs) - 1]['file']));
					}
				}
			}
		}
	}	
}