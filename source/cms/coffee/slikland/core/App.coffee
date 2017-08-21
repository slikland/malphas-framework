#import slikland.event.EventDispatcher

class App extends EventDispatcher
	@project_version_raw : "SL_PROJECT_VERSION:0.0.0"
	@project_date_raw : "SL_PROJECT_DATE:0000000000000"

	@FRAMEWORK_VERSION : "2.2.15"

	constructor:()->
		super

	getInfo:()->
		info = {}

		info.versionRaw = if App.project_version_raw == undefined || App.project_version_raw == 'undefined' then 'SL_PROJECT_VERSION:'+'Not versioned' else App.project_version_raw
		info.version = info.versionRaw.replace('SL_PROJECT_VERSION:', '')

		info.lastUpdateRaw = if App.project_date_raw == undefined || App.project_date_raw == 'undefined' then 'SL_PROJECT_DATE:'+'Not versioned' else App.project_date_raw
		info.lastUpdate = new Date(parseFloat(info.lastUpdateRaw.replace('SL_PROJECT_DATE:', '')))
		return info

		@_checkWindowActivity()
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
			@_windowVisibilityChange.call window, type: if document[@_hidden] then 'blur' else 'focus'

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

		eventType = if hidden then 'windowInactive' else 'windowActive'

		try
			@dispatchEvent(new Event(eventType))
		catch err
			newEvent = document.createEvent('Event')
			newEvent.initEvent(eventType, true, true)
			@dispatchEvent(newEvent)

if !app
	app = new App()

windowLoaded = =>
	if window.remove
		window.remove('load', windowLoaded)
	else if window.detachEvent
		window.detachEvent('onload', windowLoaded)
	else
		window.onload = null
	app.trigger('windowLoad')

if window.addEventListener
	window.addEventListener('load', windowLoaded)
else if window.attachEvent
	window.attachEvent('onload', windowLoaded)
else
	window.onload = windowLoaded
