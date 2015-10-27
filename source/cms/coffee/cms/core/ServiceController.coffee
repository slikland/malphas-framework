class ServiceController extends EventDispatcher
	@getInstance:()=>
		@_instance ?= new @(arguments...)

	constructor:()->

	call:(params, showBlocker = true)->
		if showBlocker
			app.blocker.show()
		apiCall = API.call(params)
		apiCall.path = params['url']
		apiCall.hasBlocker = showBlocker
		apiCall.on(API.COMPLETE, @_callComplete)
		apiCall.on(API.ERROR, @_callError)
		return apiCall
	cancel:(apiCall)->
		apiCall.cancel()

	setURLParams:(params, clearParams = null, update = false)->
		pathData = app.router.getParsedPath()
		if !update
			_params = params
		else
			_params = pathData['params'] || {}
			for k, v of params
				_params[k] = v
			if clearParams
				for k in clearParams
					delete _params[k]

		params = []
		for k, v of _params
			params.push(k + '=' + encodeURIComponent(v))

		app.router.goto(pathData['path'] + '?' + params.join('&'), null, false)

	getURLParams:()->
		_params = app.router.getParsedPath()['params'] || {}

	_callComplete:(e, data)=>
		if e.target.hasBlocker
			app.blocker.hide()
		if !data
			return
		if data['__user']?
			app.user.setUser(data['__user'])
		if data['goto']
			app.viewController.goto(data['goto'])
		if data['refresh']
			app.viewController.goto(app.router.getCurrentPath())
		if data['__interface']
			app.viewController.renderInterface('index', data.__interface, data)
			if app.user.logged
				url = app.router.getCurrentPath()
				if !url
					url = '/'
				@call({url: url})
		else if data['__view']
			app.viewController.addView(e.target.path, data.__view)
			app.viewController.renderView(e.target.path, data)
		if data['notification']
			app.notification.showNotifications(data['notification']);

	_callError:(data)=>
		if data.target.hasBlocker
			app.blocker.hide()
		switch data.code
			when 1
				app.viewController.getInterface()
			when 2
				app.notification.showNotifications({message: data['message'], type: 1})
			# Validation error
			when 101
				app.notification.showNotifications({message: data['message'], type: 1})
		if data['notification']
			app.notification.showNotifications(data['notification']);
