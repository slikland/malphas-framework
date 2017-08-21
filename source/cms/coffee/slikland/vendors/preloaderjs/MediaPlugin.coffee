#import slikland.vendors.preloaderjs.MediaRequest
#import slikland.vendors.preloaderjs.TagMediaLoader
#import slikland.vendors.preloaderjs.MediaLoader

do ->
	'use strict'

	MediaPlugin = ->

	s = MediaPlugin

	s.getPreloadHandlers = () ->
		return {callback: MediaPlugin.handlers, types: ['sound', 'video'], extensions: ['mp3', 'mp4']}

	s.handlers = (p_loadItem, p_queue) ->
		loader = new createjs.MediaLoader(p_loadItem, false)
		return loader

	createjs.MediaPlugin = MediaPlugin
	return
