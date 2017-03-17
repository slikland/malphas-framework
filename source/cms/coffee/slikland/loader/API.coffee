#import slikland.event.EventDispatcher
#import slikland.utils.Prototypes
class API extends EventDispatcher

	@START: 'apiStart'
	@COMPLETE: 'apiComplete'
	@ERROR: 'apiError'
	@PROGRESS: 'apiProgress'
	@_interceptors: []

	@_request:()->
		if window.XMLHttpRequest then return new XMLHttpRequest()
		else if window.ActiveXObject then return new ActiveXObject("MSXML2.XMLHTTP.3.0")
	
	@call:(url, data = null, onComplete = null, onError = null, type = 'normal')->
		api = new API(url)
		if url instanceof HTMLElement && url.tagName.toLowerCase() == 'form'
			url.submit()
		else if BaseDOM? && url instanceof BaseDOM && url.element.tagName.toLowerCase == 'form'
			url.submit()

		if onComplete
			api.on(API.COMPLETE, onComplete)
		if onError
			api.on(API.ERROR, onError)
		api.type = type
		api.submit(data)
		return api

	@intercept:(regexPattern, callback)->
		if !(regexPattern instanceof RegExp)
			regexPattern = new RegExp(regexPattern)
		i = @_interceptors.length
		while i-- > 0
			if @_interceptors[i].regex == regexPattern && @_interceptors[i].callback == callback
				return
		@_interceptors.push({regex: regexPattern, callback: callback})

	@unintercept:(regexPattern, callback = null)->
		i = @_interceptors.length
		while i-- > 0
			if @_interceptors[i].regex == regexPattern && (callback && @_interceptors[i].callback == callback)
				@_interceptors.splice(i, 1)

	@_findInterceptor:(regexPattern, callback)->
		i = @_interceptors.length
		interceptors = []
		while i-- > 0
			interceptor = @_interceptors[i]
			if interceptor.regex == regexPattern && interceptor.callback == callback
				interceptors.push(interceptor)
		return interceptors
	@_checkInterceptor:(url, data)->
		l = @_interceptors.length
		i = -1
		while ++i < l
			interceptor = @_interceptors[i]
			interceptor.regex.lastIndex = 0
			if interceptor.regex.test(url)
				interceptor.callback?(data, url)


	# FORM
	# URL
	# Object

	constructor: (arg) ->
		super
		@TYPES = ['normal', 'json']
		@_headers = []
		@_reuse = true
		@_method = 'POST'
		@_jsonp = false
		@_type = 'normal'
		if arg instanceof HTMLElement && arg.tagName.toLowerCase() == 'form'
			@_form = arg
			setTimeout(@_addEventListeners, 10)
		else if BaseDOM? && arg instanceof BaseDOM && arg.element.tagName.toLowerCase == 'form'
			@_form = arg
			setTimeout(@_addEventListeners, 10)
		else if typeof(arg) == 'string'
			@_url = arg
		else if arg?
			throw new Error('The API constructor argument needs to be a URL string or a Form element.')

	@get reuse:()->
		return @_reuse
	@set reuse:(value)->
		@_reuse = Boolean(value)

	@get type:()->
		return @_type
	@set type:(value)->
		if !(value in @TYPES)
			throw new Error('API.type can only be: ' + @TYPES.join(', '))
		@_type = value

	@get method:()->
		return @_method
	@set method:(value)->
		if !/^(get|post)$/i.test(value)
			throw new Error('Method can only be either GET or POST')
		@_method = value.toUpperCase()

	# Not implemented yet
	@get jsonp:()->
		throw new Error('Not implemented yet')
		return @_jsonp
	@set jsonp:(value)->
		throw new Error('Not implemented yet')
		@_jsonp = Boolean(@_jsonp)

	@get data:()->
		return @_data

	@get requestURL:()->
		return @_requestURL

	_addEventListeners:()=>
		if @_form
			@_form.on('submit', @_submitForm)
	_submitForm:(e)=>
		@submit()

	addHeader:(name, value)->
		@_headers[name] = value
	removeHeader:(name)->
		@_headers[name] = null
		delete @_headers[name]

	load:(url, data = null)->
		@_url = url
		@submit(data)

	submit:(data = null)=>
		@_data = data
		if @_submitting
			return
		@_submitting = true

		if data instanceof HTMLElement && data.tagName.toLowerCase() == 'form'
			@_form = data
			data = null
		else if BaseDOM? && data instanceof BaseDOM && data.element.tagName.toLowerCase == 'form'
			@_form = data.element
			data = null

		url = @_url || ''
		if @_form
			if @_form.hasAttribute('action')
				url = @_form.getAttribute('action')
			if @_form.hasAttribute('enctype')
				@addHeader('Content-type', @_form.getAttribute('enctype'))
			if @_form.hasAttribute('method')
				@method = @_form.getAttribute('method')
			if @_form.hasAttribute('type') && @_form.getAttribute('type') == 'json'
				@addHeader('Content-type', 'application/json;charset=UTF-8')
				data = JSON.stringify(@_parseJSON(@_form))
			else
				data = new FormData(@_form)
		else

			if @_type == 'normal'
				if !data
					data = new FormData()
				if data && !(data instanceof FormData)
					d = new FormData();
					d.append n, v for n, v of data
					data = d
			else if @_type == 'json'
				@addHeader('Content-type', 'application/json;charset=UTF-8')
				data = JSON.stringify(data)


		getValues = {}
		urlParams = window.location.search
		if urlParams
			urlParams = urlParams.replace(/^\??/, '').split('&')
			for up in urlParams
				parts = up.split('=')
				if parts[0]?.trim().length > 0
					getValues[parts[0].trim()] = parts[1]?.trim()

		getStr = []
		for k, v of getValues
			getStr.push(k + '=' + v)
		getStr = getStr.join('&')
		if getStr.length > 0
			if url.indexOf('?') >= 0
				url += '&' + getStr
			else
				url += '?' + getStr
		@_requestURL = url
		@_request = API._request()
		@_request.onreadystatechange = @_loaded
		@_request.upload?.addEventListener('progress', @_progress)
		@_request.addEventListener('progress', @_progress)
		@_request.open(@method, url, true)
		if @_headers
			for k, v of @_headers
				@_request.setRequestHeader(k, v)
		if @_form && @_form.getAttribute('globalLoading')
			@_loading = new cms.ui.Loading()
			@_loading.css({'position': 'fixed'})
			@_loading.show()
			window.addEventListener('resize', @_loadingResize)

			app.interface.context.appendChildAt(@_loading, 0)
			setTimeout(@_loadingResize, 0)
		@trigger(API.START)
		@_request.send(data)
		return 
	_hideLoading:()=>
		if @_loading
			@_loading?.progress = 1
			@_loading.on(cms.ui.Loading.HIDE_COMPLETE, @_loadingHideComplete)
			@_loading.hide()

	_loadingHideComplete:()=>
		if @_loading.element.parentNode
			@_loading.element.parentNode.removeChild(@_loading.element)
		@_loading.remove()
		@_loading.off(cms.ui.Loading.HIDE_COMPLETE, @_loadingHideComplete)
		@_loading.destroy?()
		@_loading = null
		window.removeEventListener('resize', @_loadingResize)
		delete @_loading


	_progress:(e)=>
		if e.loaded > e.total
			p = 0.5
		else
			p = e.loaded / e.total
		p *= 0.5
		if e.currentTarget != @_request.upload
			p += 0.5
		@_loading?.progress = p
		@_triggerProgress(p)
	_triggerProgress:(progress)->
		@trigger(API.PROGRESS, {loaded: progress, total: 1, progress: progress})

	_parseJSON:(form)->
		@_parsedElements = []
		result = @_parseJSONElement(form)
		return result
	_parseJSONElement:(element, indent = 0)=>
		items = element.querySelectorAll('[json-name]')
		o = {}
		ind = ''
		i = indent
		while i-- > 0
			ind += ' '
		addC = 0
		for item in items
			if @_parsedElements.indexOf(item) >= 0
				continue
			@_parsedElements.push(item)

			name = item.getAttribute('json-name')
			
			if data = @_parseJSONElement(item, indent + 2)
				if !o[name]
					o[name] = []
				o[name].push(data)
		inputs = element.querySelectorAll('input,textarea')
		for input in inputs
			if @_parsedElements.indexOf(input) >= 0
				continue
			@_parsedElements.push(input)
			value = input.value
			if input.hasAttribute('type')
				switch input.getAttribute('type').toLowerCase()
					when 'radio', 'checkbox'
						if !o[input.name]
							o[input.name] = []
						if !input.checked
							continue
			if o[input.name]
				if !Array.isArray(o[input.name])
					o[input.name] = [o[input.name]]
				o[input.name].push(value)
			else
				o[input.name] = value
		return o
	abort:->
		@_submitting = false
		if @_request
			@_request.onreadystatechange = null
			@_request.abort()
		if !@_reuse
			@off()
	_loaded:(e)=>
		if e.currentTarget.readyState == 4
			@_submitting = false
			if e.currentTarget.status == 200
				@_triggerProgress(1)

				response = e.currentTarget.responseText || e.currentTarget.response || ''
				try 
					data = eval('(' + response + ')')
				catch e
					try
						data = JSON.stringify(response)
				if !data
					data = response
				else if typeof(data) == 'string'
					data = response
				if data?.error
					return @_loadError(data)
				else
					return @_loadSuccess(data)
			else
				if e.currentTarget.status == 404
					return @_loadError({message: ''})
				else
					return @_loadError({message: ''})
			if !@_reuse
				@off()
	_loadSuccess:(data = null)->
		@_hideLoading()
		@trigger(API.COMPLETE, data)
		@constructor._checkInterceptor(@_requestURL, data)

	_loadError:(data = null)->
		@_hideLoading()
		@trigger(API.ERROR, data)
		@constructor._checkInterceptor(@_requestURL, data)
	_loadingResize:()=>
		if !@_loading
			return
		bounds = app.interface.context.getBounds()
		@_loading.css({
			'top': bounds.top + 'px'
			'left': bounds.left + 'px'
			'height': bounds.height + 'px'
			'width': bounds.width + 'px'
		})
