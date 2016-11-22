#namespace cms.ui.tag.attributes
class Service extends cms.ui.Base
	@SELECTOR: '[service]'
	_update:(data)->
		for item in data.add
			if item.hasAttribute('service')
				@_plugins[item] = new Plugin(item)

		for item in data.remove
			p = @_plugins[item]
			if p
				p.destroy?()

	class Plugin extends BaseDOM
		@_destroyPlugin:(item)->

		constructor:(element)->
			super({element: element})
			@_element.on('update', @_update)
			@_loadServiceTimeout = setTimeout(@_loadService, 1)
		_update:()=>
			clearTimeout(@_loadServiceTimeout)
			@_loadServiceTimeout = setTimeout(@_loadService, 300)

		_loadService:()=>
			clearTimeout(@_loadServiceTimeout)
			data = @_parseData()
			@_api = API.call(@_element.getAttribute('service'), data, @_serviceLoaded, @_serviceError)
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

				sort = ArrayUtils.toArray(@_element.querySelectorAll('[sort][value]'))
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

		_serviceLoaded:(e, data)=>
			app.template.renderBlock(@_element, data)
			if @attr('id')
				id = @attr('id')
				items = document.querySelectorAll('[for=' + id + ']')
				i = items.length
				while i-- > 0
					items[i].trigger('update', data)
			@_element.trigger('updated', data)
			@_removeEventListeners()
			@_removeProgress()
		_serviceError:()=>
			@_removeEventListeners()
			@_removeProgress()
		_sortByOrder:(a, b)=>
			if a.sortOrder < b.sortOrder
				return -1
			else if a.sortOrder > b.sortOrder
				return 1
			return 0