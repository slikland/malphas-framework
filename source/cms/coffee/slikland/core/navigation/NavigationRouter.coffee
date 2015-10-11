class NavigationRouter extends EventDispatcher

	@CHANGE: 'route_path_change'
	@ROUTE: 'route_match'

	###################
	## Class methods ##
	###################

	constructor:()->
		@_routes = []
		@_numRoutes = 0
		@_trigger = true

	# Initializer
	#
	# rootPath - {String} to root path
	# forceHashBang - {Boolean} to force hash bang
	#
	# Use root path if not set in base tag
	init:(p_rootPath = null, p_forceHashBang = false)->
		if !p_rootPath
			p_rootPath = window.location.href
			try
				base = document.getElementsByTagName('base')
				if base.length > 0
					base = base[0]
					p_rootPath = base.getAttribute('href')
		@_rootPath = p_rootPath.replace(/^(.*?)\/*$/, '$1/')
		@defaultTitle = document.title

		if p_forceHashBang
			@_usePushState = false
		else
			@_usePushState = window?.history?.pushState?
		@_rawPath = ''
		if @_usePushState
			if @_rootPath != window.location.href
				path = @_getPath()
				@goto(path, false)
			if window.addEventListener
				window.addEventListener('popstate', @_onPathChange)
			else
				# fix to browsers that not support addEventListener
				window.attachEvent("onpopstate", @_onPathChange)
		else
			if @_rootPath != window.location.href
				path = @_getPath()
				window.location = @_rootPath + '#!/' + path
			if window.addEventListener
				window.addEventListener('hashchange', @_onPathChange)
			else
				# fix to browsers that not support addEventListener
				window.attachEvent("onhashchange", @_onPathChange)
		return @

	#####################
	## Path controller ##
	#####################
	_getPath:()->
		rawPath = window.location.href
		hasSlash = rawPath.substr(rawPath.length-1, rawPath.length) == '/'
		if hasSlash
			rawPath = rawPath.substr(0, rawPath.length-1)

		if rawPath.indexOf(@_rootPath) == 0
			rawPath = rawPath.substr(@_rootPath.length)
		rawPath = rawPath.replace(/^(?:#?!?\/*)([^?]*\??.*?)$/, '$1')
		return rawPath

	_parsePath:(p_rawPath)->
		pathParts = /^(?:#?!?\/*)([^?]*)\??(.*?)$/.exec(p_rawPath)
		path = pathParts[1]
		params = @_parseParams(pathParts[2])
		return {rawPath: p_rawPath, path: path, params: params}

	_parseParams:(p_path)->
		params = {}
		if p_path
			pRE = /&?([^=&]+)=?([^=&]*)/g
			c = 0
			while o = pRE.exec(p_path)
				params[o[1]] = o[2]
		return params

	_onPathChange:()=>
		@_currentPath = @_getPath()
		if @_trigger
			@_triggerPath(@_currentPath)
		@_trigger = true
		if @_replaceData
			@goto(@_replaceData[0], @_replaceData[1], false)
			@_replaceData = null
		else
			@trigger(NavigationRouter.CHANGE, @_parsePath(@_currentPath))

	_triggerPath:(p_path)->
		pathData = @_parsePath(p_path)
		[routes, routeData] = @_checkRoutes(pathData.path)
		if routes
			i = routes.length
			while i-- > 0
				route = routes[i]
				route.callback?(route.route, routeData, p_path, pathData, route.data)
				@trigger(NavigationRouter.ROUTE, {route: route.route, routeData: routeData, path: p_path, pathData: pathData, data: route.data})

	setTitle:(p_title)->
		document.title = p_title

	getCurrentPath:()->
		return @_currentPath

	getParsedPath:()->
		return @_parsePath(@_currentPath)

	goto:(p_path, p_title = null, p_trigger = true)->
		# console.log 'p_path', p_path, typeof(p_path)
		p_path = p_path.replace(/^(?:#?!?\/*)([^?]*\??.*?)$/, '$1')
		if p_title
			@setTitle(p_title)
		if p_path == @_currentPath
			return
		@_currentPath = p_path
		@_trigger = p_trigger
		if @_usePushState
			history.pushState({}, p_path, @_rootPath + p_path)
			if @_trigger
				@_onPathChange()
			@_trigger = true
		else
			window.location.hash = '!' + '/' + p_path
	
	replace:(p_path, p_title = null, p_trigger = false)->
		p_path = p_path.replace(/^(?:#?!?\/*)([^?]*\??.*?)$/, '$1')
		if p_title
			@setTitle(p_title)
		if p_path != @_currentPath
			@_currentPath = p_path
			if @_usePushState
				history.replaceState({}, p_path, @_rootPath + p_path)
			else
				@_trigger = false
				history.back()
				@_replaceData = [p_path, p_title]
		if p_trigger
			@triggerPath(p_path)

	triggerPath:(p_path)->
		@_triggerPath(p_path)

	triggerCurrentPath:()->
		@_triggerPath(@_getPath())

	############
	## Routes ##
	############

	# Add a route
	#
	# route - {String} to route
	# callback - {Function} to callback
	# data - {Object} to data
	addRoute:(p_route, p_callback, p_data = null)->
		
		if typeof(p_route)!='string'
			i = p_route.length
			while i-- > 0
				@addRoute(p_route[i], p_callback, p_data)
		else

		r = /\{(.*?)\}/g
		labels = []
		p = 0	
		while o = r.exec(p_route)
			labels[p++] = o[1]
		r = p_route
		if r == '*'
			r = '.*'
		try
			r = r.replace(/(.*?)\/*$/, '$1')
			routeRE = new RegExp('(?:' + r.replace(/\{.*?\}/g, '(.+?)') + '$)', 'g')
		catch e
			return
		@_routes[@_numRoutes++] = {data: p_data, route: p_route, routeRE: routeRE, labels: labels, numLabels: labels.length, numSlashes: p_route.split('/').length, callback: p_callback}
		@_routes.sort(@_sortRoutes)

	# Remove a route
	#
	# route - {String} to route
	# callback - {Function} to callback
	removeRoute:(p_route, p_callback)->
		i = @_numRoutes
		while i-- > 0
			route = @_routes[i]
			if route.route == p_route
				if p_callback
					if p_callback == route.callback
						@_routes.splice(i, 1)
				else
					@_routes.splice(i, 1)

		@_numRoutes = @_routes.length

	removeAllRoutes:()->
		@_routes.length = 0
		@_numRoutes = @_routes.length

	_checkRoutes:(p_path)->
		i = @_numRoutes
		p_path = '/' + p_path
		foundRoute = null
		routes = []
		routesIndex = 0

		data = null
		while i-- > 0
			route = @_routes[i]
			if foundRoute
				if route.route == foundRoute
					routes[routesIndex++] = route
				else
					break
			re = route.routeRE
			re.lastIndex = 0

			if !(o = re.exec(p_path))
				continue
			data = {}
			routes[routesIndex++] = route
			foundRoute = route.route
			for label, j in route.labels
				v = o[j + 1]
				data[label] = v
		return [routes, data]

	_sortRoutes:(p_a, p_b)->
		if p_a.numLabels < p_b.numLabels
			return -1
		if p_a.numLabels > p_b.numLabels
			return 1
		if p_a.numSlashes < p_b.numSlashes
			return -1
		if p_a.numSlashes > p_b.numSlashes
			return 1
		if p_a.route == p_b.route
			return 0
		if p_a.route < p_b.route
			return -1
		if p_a.route > p_b.route
			return 1
		return 0
