#import slikland.loader.API
class User extends EventDispatcher
	@STATUS_CHANGE: 'user_statusChange'
	@API_PATH: '../api/cms/user/'
	constructor:()->
		super
		@_logged = false
		API.intercept(/api\/cms\/user\/.+/g, @_userAPIIntercepted)
		@_getUser()
	_userAPIIntercepted:(data, url)=>
		type = url.replace(/^.*?api\/cms\/user\/([^\?]*)\??.*$/, '$1')
		if data.error?
			switch data.code
				when 100
					"Not logged"
					@_showLogin()
				when 101
					"Login error"
				when 102
					"No permission"
		else
			switch type
				when 'getUser', 'login'
					@_data = data
					@_changeStatus(true)
					app.interface.show()
				when 'forgot'
					2
				when 'changePassword'
					3
				when 'logout'
					@_changeStatus(false)
					@_logged = false
					@_showLogin()
	@get data:()->
		return @_data
	@get logged:()->
		return @_logged

	_changeStatus:(logged)->
		@_logged = logged
		@trigger(@constructor.STATUS_CHANGE, logged)

	_getUser:()->
		API.call(@constructor.API_PATH + 'getUser')

	_showLogin:()->
		if !app.template.isCurrent('user/login')
			app.template.render('user/login', null, document.body)
	_showLoginError:()->


	_mouseDown:()=>
		@_showLogin()