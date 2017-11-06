#import slikland.loader.API
class User extends EventDispatcher
	@STATUS_CHANGE: 'user_statusChange'
	@API_PATH: 'api/cms/user/'
	constructor:()->
		super
		@_logged = false
		API.intercept(/api\/cms\/user\/.+/g, @_userAPIIntercepted)
		@_getUser()

		app.on('check_user', @_checkUser)
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
					params = app.router.getParsedPath()['params']
					if params['__redirect__']
						app.router.removeParam('__redirect__')
						window.location = decodeURIComponent(params['__redirect__'])

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

	_checkUser:()=>
		@_getUser()

	_getUser:()->
		API.call(app.rootPath + @constructor.API_PATH + 'getUser')

	_showLogin:()->
		if !app.template.isCurrent('user/login')
			pathObj = {}
			parsedPath = app.router.getParsedPath()
			page = parsedPath['path']
			page = page.replace(/(\?|\#).*?$/, '')
			pageParts = page.trim('/').split('/')
			for k, v of pageParts
				pathObj[k] = v
			for k, v of parsedPath.params
				pathObj[k] = v
			slikland.Mara.setGlobalObject('$', pathObj)

			app.template.render('user/login', null, document.body)
	_showLoginError:()->


	_mouseDown:()=>
		@_showLogin()