class ServiceController extends EventDispatcher
	@getInstance:()=>
		@_instance ?= new @(arguments...)

	constructor:()->

	call:(params)->
		apiCall = API.call(params)
		apiCall.on(API.COMPLETE, @_callComplete)
		apiCall.on(API.ERROR, @_callError)
	cancel:(apiCall)->
		apiCall.cancel()

	_callComplete:(e, data)=>
		console.log(data)
		if !data
			return
		if data['__user']?
			app.user.setUser(data['__user'])
		if data['__interface']
			app.viewController.renderInterface('index', data.__interface, data.data)
		else if data['__view']
			1
			# app.viewController.addView('index', data.__interface)
			# app.viewController.renderView('index', data.data, document.body)


	_callError:(data)=>
		switch data.code
			when 1
				app.viewController.getInterface()

