#import slikland.core.navigation.NavigationController
#import slikland.core.navigation.NavigationRouter

class Navigation extends EventDispatcher
	_controller = null
	_router = null

	constructor: () ->
		_controller = new NavigationController()
		_router = new NavigationRouter()

		app.navigation = @

	setup:(p_data)=>
		_controller.setup(p_data)
		_controller.on(NavigationController.CHANGE_VIEW, @_changeViews)

		_router.init(app.root)
		# for k, v of p_data.views
		# 	if v.route? then _router.addRoute(v.route, @_changeRoute)

		# _router.addRoute('/galeria(/{id})?', @_routeChange)
		# _router.addRoute('/gale/{id}/{bla2}', @_routeChange)
		# _router.addRoute('/gale/{id}/{bla}', @_routeChange)
		# _router.addRoute('/gale/{id}', @_routeChange)
		# _router.triggerCurrentPath()
		
		if app.config.navigation?.autoStart || app.config.navigation?.autoStart is undefined
			@start()

	start:(evt=null)=>
		_controller.start()
		false
	
	gotoDefault:()=>
		id = app.config.navigation?.defaultView
		view = app.config.views[id]

	@get currentView:->
		return @_currentView

	@get previousView:->
		return @_previousView

	goto:(p_value)=>
		# view = @_validate(p_value)
		# if view.route? then _router.goto(view.route)
		_controller.goto(p_value)
		# _router.triggerCurrentPath()

		# console.log _router.getCurrentPath()
		# console.log _router.getParsedPath()

	_validate:(p_value)=>
		result = null
		for k, v of app.config.views
			if v.route? && p_value is v.route || v.route? && p_value is v.id
				result = v
				break
			else 
				if p_value is v.id
					result = v
				else 
					result = if app.config.navigation?.defaultView? then app.config.views[app.config.navigation?.defaultView]
		return result

	_changeViews:(evt)=>
		@_currentView = evt.currentView
		@_previousView = evt.previousView

	_changeRoute:(evt)=>
		# console.log "getCurrentPath:", _router.getCurrentPath()
		# console.log "getParsedPath:", _router.getParsedPath()

		# console.log('_changeRoute:', evt)

	# _change:(evt)=>
	# 	console.log('_change:', evt)

