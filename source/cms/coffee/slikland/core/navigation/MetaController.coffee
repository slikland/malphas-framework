###*
@class MetaController
@extends EventDispatcher
@final
###
class MetaController extends EventDispatcher

	###*
	Runtime controls some meta tags of current view.<br>
	For add/edit these tags or values, put the meta object in content file, like explained below:

	@class MetaController
	@constructor
	@example
	```
	"meta":
	{
		"title": "Default Template - title",
		"description":"description",
		"webAppCapable":"true",
		"color":"#ff00ff",
		"manifest":"{base}data/manifest.json",
		"favicon":"{images}icons/favicon-default.ico",
		"icons":[
			{
				"rel":"apple-touch-icon", 
				"sizes":"57x57",
				"href":"{images}icons/apple-touch-icon-57x57.png"
			},
			{
				"rel":"apple-touch-icon", 
				"sizes":"60x60",
				"href":"{images}icons/apple-touch-icon-60x60.png"
			},
			{
				"rel":"apple-touch-icon", 
				"sizes":"72x72",
				"href":"{images}icons/apple-touch-icon-72x72.png"
			},
			{
				"rel":"apple-touch-icon", 
				"sizes":"76x76",
				"href":"{images}icons/apple-touch-icon-76x76.png"
			},
			{
				"rel":"apple-touch-icon", 
				"sizes":"114x114",
				"href":"{images}icons/apple-touch-icon-114x114.png"
			},
			{
				"rel":"apple-touch-icon", 
				"sizes":"120x120",
				"href":"{images}icons/apple-touch-icon-120x120.png"
			},
			{
				"rel":"apple-touch-icon", 
				"sizes":"144x144",
				"href":"{images}icons/apple-touch-icon-144x144.png"
			},
			{
				"rel":"apple-touch-icon", 
				"sizes":"152x152",
				"href":"{images}icons/apple-touch-icon-152x152.png"
			},
			{
				"rel":"apple-touch-icon", 
				"sizes":"180x180",
				"href":"{images}icons/apple-touch-icon-180x180.png"
			},

			{
				"rel":"icon",
				"href":"{images}icons/favicon-16x16.png", 
				"sizes":"16x16"
			},
			{
				"rel":"icon",
				"href":"{images}icons/favicon-32x32.png", 
				"sizes":"32x32"
			},
			{
				"rel":"icon",
				"href":"{images}icons/favicon-96x96.png", 
				"sizes":"96x96"
			},
			{
				"rel":"icon",
				"href":"{images}icons/android-chrome-192x192.png", 
				"sizes":"192x192"
			}
		]
	}
	```
	###
	constructor: () ->
		super

	@getInstance:()=>
		@_instance ?= new @()
	###*
	@method change
	@param {Object} p_data
	###
	change: (p_data) ->
		if p_data?
			for k, v of p_data
				try
					@[k] = v
				catch e

		false

	###*
	@method applyMeta
	@param {String} p_name
	@param {String} p_value
	@protected
	###
	applyMeta: (p_name, p_value) ->
		if p_value?
			if document.querySelector('meta[name='+p_name+']')?
				document.querySelector('meta[name='+p_name+']').content = p_value
			else
				meta = document.createElement('meta')
				meta.name = p_name
				meta.content = p_value
				@head.appendChild(meta)
		false

	###*
	@method applyLink
	@param {String} p_rel
	@param {String} p_value
	@protected
	###
	applyLink: (p_rel, p_href, p_others=null) ->
		link = document.createElement('link')
		link.rel = p_rel
		link.href = p_href
		if p_others? && typeof(p_others) == "object"
			for k, v of p_others
				link[k] = v
		@head.appendChild(link)
		false

	###*
	@attribute head
	@type {HTMLElement}
	@readOnly
	###
	@get head:()->
		return document.head || document.getElementsByTagName('head')[0]

	###*
	@attribute viewport
	@type {String}
	###
	@set viewport:(p_value)->
		@applyMeta('viewport', p_value)

	###*
	@attribute title
	@type {String}
	###
	@set title:(p_value)->
		if p_value?
			document.title = p_value
			
			# iOS
			@applyMeta('apple-mobile-web-app-title', p_value)

	###*
	@attribute description
	@type {String}
	###
	@set description:(p_value)->
		@applyMeta('description', p_value)

	###*
	@attribute favicon
	@type {String}
	###
	@set favicon:(p_value)->
		if !@_favicon?
			@_favicon = p_value
			@applyLink('icon', p_value, {"type":"image/x-icon"})
		false

	###*
	@attribute icons
	@type {String}
	###
	@set icons:(p_value)->
		for k, v of p_value
			@applyLink(v['rel'], v['href'], {"sizes":v["sizes"]})
		false

	###*
	*Only for iOS
	@attribute splash
	@type {String}
	###
	@set splash:(p_value)->
		@applyLink('apple-touch-startup-image', p_value)
		false

	###*
	@attribute webAppCapable
	@type {String}
	###
	@set webAppCapable:(p_value)->
		value = if p_value == true || p_value == "true" then 'yes' else 'no'
		# All
		@applyMeta('mobile-web-app-capable', value)

		# iOS
		@applyMeta('apple-mobile-web-app-capable', value)
		false

	###*
	@attribute color
	@type {String}
	###
	@set color:(p_color)->
		# All
		@webAppCapable = true

		# Chrome
		@applyMeta('theme-color', p_color)

		# Windows Phone
		@applyMeta('msapplication-navbutton-color', p_color)

		# iOS
		@applyMeta('apple-mobile-web-app-status-bar-style', 'black-translucent')
		false

	###*
	*Only for Android
	@attribute manifest
	@type {String}
	@example
	```
	{
	  "lang": "en",
	  "scope": "/scope/",	  
	  "name": "Web Application Manifest Sample",
	  "short_name": "Application",
	  "display": "standalone",
	  "orientation": "landscape",
	  "start_url": "index.html",
	  "theme_color": "aliceblue",
	  "background_color": "blue",
	  "icons": [
	    {
	      "src": "launcher-icon-0-75x.png",
	      "sizes": "36x36",
	      "type": "image/png",
	      "density": 0.75
	    },
	    {
	      "src": "launcher-icon-1x.png",
	      "sizes": "48x48",
	      "type": "image/png",
	      "density": 1.0
	    },
	    {
	      "src": "launcher-icon-1-5x.png",
	      "sizes": "72x72",
	      "type": "image/png",
	      "density": 1.5
	    },
	    {
	      "src": "launcher-icon-2x.png",
	      "sizes": "96x96",
	      "type": "image/png",
	      "density": 2.0
	    },
	    {
	      "src": "launcher-icon-3x.png",
	      "sizes": "144x144",
	      "type": "image/png",
	      "density": 3.0
	    },
	    {
	      "src": "launcher-icon-4x.png",
	      "sizes": "192x192",
	      "type": "image/png",
	      "density": 4.0
	    }
	  ]
	}	
	```
	###
	@set manifest:(p_value)->
		@applyLink('manifest', p_value)
		false
