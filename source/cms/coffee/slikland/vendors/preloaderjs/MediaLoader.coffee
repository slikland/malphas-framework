@createjs = @createjs or {}
do ->
	MediaLoader = (loadItem, preferXHR) ->
		@___item = loadItem
		if loadItem.type == "video"
			@TagMediaLoader_constructor loadItem, preferXHR, createjs.AbstractLoader.VIDEO
			if createjs.RequestUtils.isVideoTag(loadItem) or createjs.RequestUtils.isVideoTag(loadItem.src)
				@setTag if createjs.RequestUtils.isVideoTag(loadItem) then loadItem else loadItem.src
				@_preferXHR = false
			else
				@setTag @_createTag()
		else
			@TagMediaLoader_constructor loadItem, preferXHR, createjs.AbstractLoader.SOUND
			if createjs.RequestUtils.isAudioTag(loadItem)
				@_tag = loadItem
			else if createjs.RequestUtils.isAudioTag(loadItem.src)
				@_tag = loadItem
			else if createjs.RequestUtils.isAudioTag(loadItem.tag)
				@_tag = if createjs.RequestUtils.isAudioTag(loadItem) then loadItem else loadItem.src
			if @_tag != null
				@_preferXHR = false
		return

	'use strict'
	s = MediaLoader
	p = createjs.extend(MediaLoader, createjs.TagMediaLoader)

	p._createTag = (src) ->
		if @___item.type is 'video'
			tag = document.createElement 'video'
			tag.type = "video/mp4"
			tag.preload = 'auto'
		else
			tag = document.createElement 'audio'
			tag.type = "audio/mpeg"
			tag.preload = 'none'
			#LM: Firefox fails when this the preload="none" for other tags, but it needs to be "none" to ensure PreloadJS works.
			tag.src = src

		if @___item.id?
			tag.id = @___item.id

		if !@___item.autoplay || @___item.autoplay is undefined
			tag.autoplay = false
		else
			tag.autoplay = @___item.autoplay
		
		if !@___item.loop || @___item.loop is undefined
			tag.loop = false
		else
			tag.loop = @___item.loop
		
		if !@___item.volume || @___item.volume is undefined
			tag.volume = 1
		else
			tag.volume = @___item.volume
		return tag

	s.canLoadItem = (item) ->
		return if @___item.type == 'video' then item.type == createjs.AbstractLoader.VIDEO else item.type == createjs.AbstractLoader.SOUND

	createjs.MediaLoader = createjs.promote(MediaLoader, 'TagMediaLoader')
	return


