#namespace cms.ui.tag.attributes
class PingService extends cms.ui.Base
	@SELECTOR: '[pingservice]'

	@_queue: []
	_update:(data)->
		for item in data.add
			if item.hasAttribute('pingservice')
				@_plugins[item] = new Plugin(item)

		for item in data.remove
			p = @_plugins[item]
			@removeQueue(p)
			if p
				p.destroy?()

	removeQueue:(plugin)->

	queueService:(plugin, delay = 0)->
		# _queue

	_sortByOrder:(a, b)->
		if a.order > b.order
			return 1
		if a.order < b.order
			return -1
		return 0

	class Plugin extends BaseDOM
		@_destroyPlugin:(item)->

		constructor:(element)->
			super({element: element})
			@_refreshInterval = Number(@attr('pingInterval'))
			if isNaN(@_refreshInterval) || @_refreshInterval <= 0
				@_refreshInterval = 10
			@_element.on('update', @_update)
			@_element.on('abort', @_abort)
			@_loadServiceTimeout = setTimeout(@_loadService, 1)

		destroy:()->
			@_element.off('update', @_update)
			@_element.off('abort', @_abort)
			@_abort()
			super
		_abort:()=>
			@_clearTimeout()
			@_api?.abort()
			@_api?.off(API.PROGRESS, @_onProgress)
			@_removeProgress()

		_update:(e, data)=>
			@_clearTimeout()
			@_loadServiceTimeout = setTimeout(@_loadService, 300)

		_loadService:()=>
			if @_isLoading
				return
			@_clearTimeout()
			@_isLoading = true
			data = @_parseData()
			@_api = API.call(@_element.getAttribute('pingService'), data, @_serviceLoaded, @_serviceError)
			@_api.on(API.PROGRESS, @_onProgress)
			@_showProgress()
		_removeEventListeners:()->
			@_api.off(API.PROGRESS, @_onProgress)
		_removeProgress:()=>
			if @_loading
				@_loading.hide()
		_showProgress:()=>
			if @element.hasAttribute('noloading')
				return
			if !@_loading
				@_loading = new cms.ui.Loading()
			@_loading.reset()
			@_loading.show()
			@appendChildAt(@_loading, 0)
		_onProgress:(e, data)=>
			@_loading?.progress = data.progress
		_parseData:()=>
			params = app.router.getParam(@attr('id'))
			if @attr('id')
				id = @attr('id')
				params = {}
				paramSet = false
				items = document.querySelectorAll('[for=' + id + ']')
				for item in items
					multiple = false
					name = item.getAttribute('name')
					value = item.value
					switch item.tagName.toLowerCase()
						when 'input'
							if item.getAttribute('type') in ['checkbox']
								multiple = true
							if item.getAttribute('type') in ['checkbox','radio']
								if !item.checked
									value = null
						when 'pagination'
							if item.index
								paramSet = true
								params['_index'] = item.index
							if item.numItems
								params['_numItems'] = item.numItems
						else
							if item.hasAttribute('sort')
								continue
					if value
						paramSet = true
						if multiple
							if !params[name]
								params[name] = []
							params[name].push(value)
						else
							params[name] = value

				sort = [].concat(ArrayUtils.toArray(@_element.querySelectorAll('[sort][value]')), ArrayUtils.toArray(document.querySelectorAll('[for="'+id+'"][sort][value]')))
				if sort.length > 0
					sort.sort(@_sortByOrder)
					sortValues = []
					i = sort.length
					while i-- > 0
						sortValues[i] = sort[i].value
					paramSet = true
					params['sort'] = sortValues
				if paramSet
					app.router.setParam(id, params)
				else
					app.router.removeParam(id)
			return params

		_checkTimeout:()->
			if @_refreshInterval
				@_loadServiceTimeout = setTimeout(@_loadService, @_refreshInterval * 1000)

		_clearTimeout:()->
			clearTimeout(@_loadServiceTimeout)

		_serviceLoaded:(e, data)=>
			i = data.length
			while i-- > 0
				item = data[i]
				if item.target
					targets = document.querySelectorAll(item.target)
					for target in targets
						app.template.renderBlock(target, item.data)
				if item.event
					app.trigger(item.event, item.data)
			@_removeEventListeners()
			@_removeProgress()
			@_checkTimeout()
			@_isLoading = false
		_serviceError:(e, data)=>
			if data?.message?.length > 0
				if !data.type
					data.type = 1
				app.notification.showNotification(data)
			if @_element.getAttribute('onError')
				app.router.goto(@_element.getAttribute('onError'))
			@_removeEventListeners()
			@_removeProgress()
			@_checkTimeout()
			@_isLoading = false
		_sortByOrder:(a, b)=>
			if a.sortOrder < b.sortOrder
				return -1
			else if a.sortOrder > b.sortOrder
				return 1
			return 0