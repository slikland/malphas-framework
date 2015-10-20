class User extends EventDispatcher
	@PING_TIMEOUT: 10
	constructor:()->
		@_firstTime = true

	@get name:()->
		return @_name
	@get id:()->
		return @_id
	@get role:()->
		return @_role
	@get roleName:()->
		return @_roleName
	setUser:(data = null)->
		if !data
			@_stopPing()
			@_name = null
			@_id = null
			@_role = null
		else if @_id != data['id']
			@_startPing()
			@_name = data['name']
			@_id = data['id']
			@_role = data['role']
			@_roleName = data['roleName']
			if !@_firstTime
				app.viewController.getInterface()
		@_firstTime = false

	logout:()->
		1

	_startPing:()->
		@_pingTimeout = setTimeout(@_ping, User.PING_TIMEOUT * 1000)
	_stopPing:()->
		clearTimeout(@_pingTimeout)
		@_pingTimeout = null
	_ping:()=>
		if !@_pingTimeout
			return
		app.serviceController.call({url: 'user/ping', onComplete: @_pingComplete})
	_pingComplete:()=>
		if @_pingTimeout
			@_startPing()