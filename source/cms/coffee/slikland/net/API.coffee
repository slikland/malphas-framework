class API extends EventDispatcher

	@COMPLETE: 'apiComplete'
	@ERROR: 'apiError'

	@ROOT_PATH: ''

	@_request:()->
		if window.XMLHttpRequest then return new XMLHttpRequest()
		else if window.ActiveXObject then return new ActiveXObject("MSXML2.XMLHTTP.3.0")
	
	# data = {
	# 	url: 'url/to/load'
	# 	params: {object}
	# 	method: 'GET' / 'POST'
	# 	type: 'json'/'text'
	# 	onComplete: callbackFunction
	# 	onError: callbackFunction
	#	headers: {
	#		Content-type: 'bla'
	#	}
	# }
	# 
	@call:(params)->
		if !params
			return
		url = params['url']
		if !url
			return
		data = params['data']
		method = params['method'] || 'POST'
		onComplete = params['onComplete'] || 'POST'
		onError = params['onError']
		type = params['type'] || 'json'
		headers = params['headers']
		api = new API(API.ROOT_PATH + url, data, 'POST', type)
		api.data = params
		if onComplete
			api.on(@COMPLETE, onComplete)
		if onError
			api.on(@ERROR, onError)
		api.load()
		return api

	constructor: (@url, @params = null, @method = 'POST', @type = 'json', @headers = null) ->
		@reuse = false

	load:(params = null)=>
		if params
			@params = params
		urlParams = window.location.search
		paramObj = {}
		if urlParams
			urlParams = urlParams.replace(/^\??/, '').split('&')
			pc = 0
			for up in urlParams
				parts = up.split('=')
				if parts[0]?.trim().length > 0
					paramObj[parts[0].trim()] =  parts[1]?.trim()
					pc++
		if pc > 0
			try
				if !@params
					@params = {}
				@params = ObjectUtils.merge(@params, paramObj)
		if @params instanceof FormData
			@method = 'POST'
			formData = @params
		else
			if @method == 'POST'
				formData = new FormData();
				formData.append n, v for n, v of @params
			else
				formData = []
				formData.push(n + '=' + v) for n, v of @params
		@req = API._request()
		@req.onreadystatechange = @_loaded
		@req.open(@method, @url, true)
		if @headers
			for k, v of @headers
				@req.setRequestHeader(k, v)
		@req.send(formData);
	cancel:->
		if @req
			@req.onreadystatechange = null
			@req.abort()
		if !@reuse
			@off()
	_loaded:(e)=>
		if e.currentTarget.readyState == 4
			if e.currentTarget.status == 200
				try
					data = e.currentTarget.responseText
					if typeof(@type) == 'function'
						data = @type(data)
					else if @type == 'json'
						data = eval('(' + e.currentTarget.responseText + ')')
					else
						try
							data = eval('(' + e.currentTarget.responseText + ')')
						catch
							data = e.currentTarget.responseText
					if data?.error
						@trigger(API.ERROR, data)
					else
						@trigger(API.COMPLETE, data)
				catch err
					console.log(err)
					@trigger(API.ERROR)
			else
				@trigger(API.ERROR)
			if !@reuse
				@off()
