###*
@class NavigationRouter
@extends EventDispatcher
@final
###
class NavigationRouter extends EventDispatcher

	###*
	@event CHANGE
	@static
	###
	@CHANGE: 'route_path_change'
	###*
	@event CHANGE_ROUTE
	@static
	###
	@CHANGE_ROUTE: 'route_match'

	###*
	@class NavigationRouter
	@constructor
	###
	constructor:()->
		@_routes = []
		@_numRoutes = 0
		@_trigger = true
		super

	###*
	@method setup
	@param {String} [p_rootPath = null] Use root path if not set in base tag
	@param {Boolean} [p_forceHashBang = false] Force hash bang for old browsers
	@return {NavigationRouter}
	###
	setup:(p_rootPath = null, p_forceHashBang = false)->
		if !p_rootPath
			p_rootPath = window.location.href
			try
				base = document.getElementsByTagName('base')
				if base.length > 0
					base = base[0]
					p_rootPath = base.getAttribute('href')
			catch err
				console.log err.stack

		@_rootPath = p_rootPath.replace(/^(.*?)\/*$/, '$1/')
		@_rawPath = ''

		if p_forceHashBang
			@_usePushState = false
		else
			@_usePushState = window?.history?.pushState?

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
		@_onPathChange()
		return @

	###*
	@method _getPath
	@return {String}
	@private
	###
	_getPath:()->
		rawPath = window.location.href.replace(/\/*$/g,'')

		if rawPath.indexOf(@_rootPath.replace(/\/*$/g,'')) == 0
			rawPath = rawPath.substr(@_rootPath.length)
		rawPath = rawPath.replace(/^(?:#?!?\/*)([^?]*\??.*?)$/, '$1')
		return rawPath

	###*
	@method _parsePath
	@param {String} p_rawPath
	@return {Object}
	@private
	###
	_parsePath:(p_rawPath)->
		pathParts = /^(?:#?!?\/*)([^?]*)\??(.*?)$/.exec(p_rawPath)
		path = pathParts[1]
		params = @_parseParams(pathParts[2])
		return {rawPath: p_rawPath, path: path, params: params}

	###*
	@method _parseParams
	@param {String} p_path
	@return {Object}
	@private
	###
	_parseParams:(p_path)->
		params = {}
		if p_path
			pRE = /&?([^=&]+)=?([^=&]*)/g
			c = 0
			while o = pRE.exec(p_path)
				params[o[1]] = o[2]
		return params

	###*
	@method _onPathChange
	@param {Event} [evt = null]
	@private
	###
	_onPathChange:(evt=null)=>
		@_currentPath = @_getPath()

		if @_trigger
			@_triggerPath(@_currentPath)
		@_trigger = true
		
		if @_replaceData
			@goto(@_replaceData[0], false)
			@_replaceData = null
		else
			@trigger(NavigationRouter.CHANGE, @_parsePath(@_currentPath))
		false

	###*
	@method _triggerPath
	@param {String} p_path
	@private
	###
	_triggerPath:(p_path)->
		pathData = @_parsePath(p_path)
		[routes, routeData] = @_checkRoutes(pathData.path)
		if routes
			i = routes.length
			while i-- > 0
				route = routes[i]
				@trigger(NavigationRouter.CHANGE_ROUTE, {route: route.route, routeData: routeData, path: p_path, pathData: pathData, data: route.data})
		false

	###*
	@method getCurrentPath
	@return {String}
	###
	getCurrentPath:()->
		return @_currentPath

	###*
	@method getParsedPath
	@return {Object}
	###
	getParsedPath:()->
		return @_parsePath(@_currentPath)

	###*
	@method goto
	@param {String} p_path
	@param {Boolean} [p_trigger = true]
	###
	goto:(p_path, p_trigger = true)->
		p_path = p_path.replace(/^(?:#?!?\/*)([^?]*\??.*?)$/, '$1')
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
		false
		
	###*
	@method replace
	@param {String} p_path
	@param {Boolean} [p_trigger = false]
	###
	replace:(p_path, p_trigger = false)->
		p_path = p_path.replace(/^(?:#?!?\/*)([^?]*\??.*?)$/, '$1')
		if p_path != @_currentPath
			@_currentPath = p_path
			if @_usePushState
				history.replaceState({}, p_path, @_rootPath + p_path)
			else
				@_trigger = false
				history.back()
				@_replaceData = [p_path]
		if p_trigger
			@triggerPath(p_path)
		false

	###*
	@method triggerPath
	@param {String} p_path
	###
	triggerPath:(p_path)->
		@_triggerPath(p_path)
		false

	###*
	@method triggerCurrentPath
	@param {String} p_path
	###
	triggerCurrentPath:()->
		@_triggerPath(@_getPath())
		false

	###*
	Add a route
	@method addRoute
	@param {String} p_route
	@param {Object} [p_data = null]
	###
	addRoute:(p_route, p_data = null)->
		# console.log "addRoute"
		if typeof(p_route)!='string'
			i = p_route.length
			while i-- > 0
				@addRoute(p_route[i], p_data)

		r = /\{(.*?)\}/g
		labels = []
		p = 0	
		while o = r.exec(p_route)
			labels[p++] = o[1]
		r = p_route
		if r == '*' then r = '.*'

		try
			r = r.replace(/(.*?)\/*$/, '$1')
			routeRE = new RegExp('(?:' + r.replace(/\{.*?\}/g, '(.+?)') + '$)', 'g')
		catch err
			console.log err.stack
			return

		@_routes[@_numRoutes++] = {data: p_data, route: p_route, routeRE: routeRE, labels: labels, numLabels: labels.length, numSlashes: p_route.split('/').length}
		@_routes.sort(@_sortRoutes)
		false

	###*
	Remove a route
	@method removeRoute
	@param {String} p_route
	###
	removeRoute:(p_route)->
		i = @_numRoutes
		while i-- > 0
			route = @_routes[i]
			if route.route == p_route
				@_routes.splice(i, 1)

		@_numRoutes = @_routes.length
		false

	###*
	Remove all routes
	@method removeAllRoutes
	###
	removeAllRoutes:()->
		@_routes.length = 0
		@_numRoutes = @_routes.length

	###*
	@method _checkRoutes
	@param {String} p_path
	@private
	@return {Array}
	###
	_checkRoutes:(p_path)->
		i = @_numRoutes
		foundRoute = null
		data = null
		routes = []
		routesIndex = 0
		p_path = '/' + p_path

		while i-- > 0
			route = @_routes[i]
			if foundRoute
				if route.route == foundRoute
					routes[routesIndex++] = route
				else
					break
			re = route.routeRE
			re.lastIndex = 0

			# if !(o = re.exec(p_path) and route.route isnt '/' or p_path is route.route)
			if !(o = re.exec(p_path))
				continue
			data = {}
			routes[routesIndex++] = route
			foundRoute = route.route
			for label, j in route.labels
				v = o[j + 1]
				data[label] = v
		return [routes, data]

	###*
	@method _sortRoutes
	@param {String} p_a
	@param {String} p_b
	@private
	@return {Number}
	###
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
	_getParams:()->
		pathData = @_parsePath(@_currentPath)
		params = pathData['params']
		for k, v of params
			v = decodeURIComponent(v)
			try
				decoded = JSON.parse(v)
				if typeof(decoded) != 'string'
					v = decoded
			params[k] = v
		return params
	_setParams:(params)->
		pathData = @_parsePath(@_currentPath)
		pArr = []
		for k, v of params
			try
				if typeof(v) != 'string'
					v = JSON.stringify(v)
			pArr.push(k + '=' + encodeURIComponent(v))
			params[k] = v

		path = pathData.path
		if pArr.length > 0
			path = path + '?' + pArr.join('&')
		@replace(path)

	getParam:(name)->
		params = @_getParams()
		return params[name]

	setParam:(name, value)->
		params = @_getParams()
		params[name] = value
		@_setParams(params)

	removeParam:(name)->
		params = @_getParams()
		params[name] = null
		delete params[name]
		@_setParams(params)
