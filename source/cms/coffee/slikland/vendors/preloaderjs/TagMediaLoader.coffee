@createjs = @createjs or {}
do ->
	TagMediaLoader = (loadItem, preferXHR, type) ->
		@AbstractLoader_constructor loadItem, preferXHR, type
		@resultFormatter = @_formatResult
		@_tagSrcAttribute = 'src'
		return

	'use strict'
	p = createjs.extend(TagMediaLoader, createjs.AbstractLoader)

	p.load = ->
		if !@_tag then @_tag = @_createTag(@_item.src)
		@_tag.preload = 'auto'
		@_tag.load()
		@AbstractLoader_load()
		return

	p._createTag = ->

	p._createRequest = ->
		@_request = new (createjs.MediaRequest)(@_item, @_tag or @_createTag(), @_tagSrcAttribute)
		return

	p._formatResult = (loader) ->
		@_tag.removeEventListener and @_tag.removeEventListener('complete', @_loadedHandler)
		@_tag.removeEventListener and @_tag.removeEventListener('canplaythrough', @_loadedHandler)
		@_tag.onstalled = null
		if @_preferXHR
			loader.getTag().src = loader.getResult(true)
		loader.getTag()

	createjs.TagMediaLoader = createjs.promote(TagMediaLoader, 'AbstractLoader')
	return
