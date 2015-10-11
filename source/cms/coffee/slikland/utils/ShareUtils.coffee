class ShareUtils

	# Public: Twitter.
	#
	# text - {String}
	# url - {String}
	# hashtags - {String}
	#
	# Examples
	#     @twitter('Slikland', 'http://slikland.com', 'digital,web,programming')
	@twitter:(p_text, p_url=null, p_hashtags=null, p_trigger=false)->
		url = 'https://twitter.com/intent/tweet?'
		if p_text    then url += '&text=' + encodeURI(p_text)
		if p_hashtags then url += '&hashtags=' + encodeURI(p_hashtags)
		if p_url     then url += '&url=' + encodeURI(p_url)
		if p_trigger then ShareUtils.open(url)
		return url

	# Public: Facebook.
	#
	# url - {String}
	@facebook:(p_url, p_uri, p_title, p_description, p_image, p_appID=null, p_display=null, p_trigger=false)->
		url = 'https://www.facebook.com/dialog/feed?'
		if p_appID then url += '&app_id=' + p_appID
		if p_image then url += '&picture=' + p_image
		if p_title then url += '&name=' + encodeURIComponent(p_title)
		if p_description then url += '&description=' + encodeURIComponent(p_description)
		url += '&display=popup'
		url += '&link=' + encodeURIComponent(p_url)
		url += '&redirect_uri=' + encodeURIComponent(p_uri)
		if p_trigger then ShareUtils.open(url)
		return url

	# Public: Google Plus
	#
	# url - {String}
	@googleplus:(p_url, p_trigger=false)->
		url = 'https://plus.google.com/share?url=' + encodeURI(p_url)
		if p_trigger then ShareUtils.open(url)
		return url

	# Public: LinkedIn.
	#
	# url - {String}
	# title - {String}
	# summary - {String}
	# source - {String}
	@linkedin:(p_url, p_title=null, p_summary=null,p_source=null, p_trigger=false)->
		url = 'https://www.linkedin.com/shareArticle?mini=true'
		params = []
		if p_url     then params.push('url=' + encodeURI(p_url))
		if p_title   then params.push('title=' + encodeURI(p_title))
		if p_summary then params.push('summary=' + encodeURI(p_summary))
		if p_source  then params.push('url=' + encodeURI(p_source))
		url += params.join('&')
		if p_trigger then ShareUtils.open(url)
		return url

	# Public: Pinterest.
	#
	# url - {String}
	# media - {String}
	# description - {String}
	@pinterest:(p_url, p_media=null, p_description=null, p_trigger=false)->
		url = 'http://www.pinterest.com/pin/create/button/?'
		params = []
		if p_url         then params.push('url=' + encodeURI(p_url))
		if p_media       then params.push('media=' + encodeURI(p_media))
		if p_description then params.push('description=' + encodeURI(p_description))
		url += params.join('&')
		if p_trigger then ShareUtils.open(url)
		return url

	# Public: Email.
	#
	# subject - {String}
	# body - {String}
	@email:(p_subject, p_body=null, p_trigger=false)->
		console.log('email')
		url = 'mailto:?'
		params = []
		if p_subject then params.push('subject=' + encodeURI(p_subject))
		if p_body    then params.push('body=' + encodeURI(p_body))
		url += params.join('&')
		if p_trigger then ShareUtils._location(url)
		console.log(url)
		return url

	# Private: call url.
	#
	# url - {string}
	# name - {string}
	# style - {string}
	@open:(p_url, p_name='',p_style='width=600,height=400')->
		window.open(p_url,p_name,p_style)

	# Private: window location.
	#
	# url - {string}
	@_location:(p_url)->
		window.location.href = p_url
