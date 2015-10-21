class ServiceController extends EventDispatcher
	@getInstance:()=>
		@_instance ?= new @(arguments...)

	constructor:()->

	call:(params)->
		apiCall = API.call(params)
		apiCall.path = params['url']
		apiCall.on(API.COMPLETE, @_callComplete)
		apiCall.on(API.ERROR, @_callError)
	cancel:(apiCall)->
		apiCall.cancel()

	_callComplete:(e, data)=>
		if !data
			return
		if data['__user']?
			app.user.setUser(data['__user'])
		if data['__interface']
			app.viewController.renderInterface('index', data.__interface, data.data)
		else if data['__view']
			console.log(e.target.path, data.__view)
			app.viewController.addView(e.target.path, data.__view)
			app.viewController.renderView(e.target.path, data.data)

	_callError:(data)=>
		switch data.code
			when 1
				app.viewController.getInterface()

