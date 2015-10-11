#import slikland.event.EventDispatcher

class App extends EventDispatcher

	@WINDOW_LOAD: 'app_windowLoad'
	@WINDOW_ACTIVE: 'app_windowActive'
	@WINDOW_INACTIVE: 'app_windowInactive'

	constructor:()->
		super
		# @_checkWindowActivity()
		# 
		# TODO: FIX IE8
		# 
	_checkWindowActivity:()->
		@_hidden = 'hidden'
		if @_hidden in document
			document.addEventListener 'visibilitychange', @_windowVisibilityChange
		else if (@_hidden = 'mozHidden') in document
			document.addEventListener 'mozvisibilitychange', @_windowVisibilityChange
		else if (@_hidden = 'webkitHidden') in document
			document.addEventListener 'webkitvisibilitychange', @_windowVisibilityChange
		else if (@_hidden = 'msHidden') in document
			document.addEventListener 'msvisibilitychange', @_windowVisibilityChange
		else if 'onfocusin' in document
			document.onfocusin = document.onfocusout = @_windowVisibilityChange
		else
			window.onpageshow = window.onpagehide = window.onfocus = window.onblur = @_windowVisibilityChange
		
		if document[@_hidden] != undefined
			@_windowVisibilityChange type: if document[@_hidden] then 'blur' else 'focus'
	
	_windowVisibilityChange:(evt)->
		v = 'visible'
		h = 'hidden'
		evtMap = 
			focus: false
			focusin: false
			pageshow: false
			blur: true
			focusout: true
			pagehide: true
		evt = evt or window.event
		if evt.type in evtMap
			hidden = evtMap[evt.type]
		else
			hidden = document[@_hidden]

		if hidden
			@dispatchEvent(App.WINDOW_INACTIVE)
		else
			@dispatchEvent(App.WINDOW_ACTIVE)

if !app
	app = new App()

windowLoaded = =>
	if window.remove
		window.remove('load', windowLoaded)
	else if window.detachEvent
		window.detachEvent('onload', windowLoaded)
	else
		window.onload = null
	app.trigger(App.WINDOW_LOAD)

if window.addEventListener
	window.addEventListener('load', windowLoaded)
else if window.attachEvent
	window.attachEvent('onload', windowLoaded)
else
	window.onload = windowLoaded
