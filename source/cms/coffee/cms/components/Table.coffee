class components.Table extends BaseDOM
	@SELECTOR: 'table'
	constructor:()->
		super
		@_values = {}
		@_parseHeader()
		@_update = @attr('update')
	destroy:()->
		@removeAll()
		@off()
		
	_parseHeader:()=>
		heads = @findAll('thead th')
		i = heads.length
		while i-- > 0
			head = heads[i]
			sort = head.getAttribute('sort')
			if !sort || sort.length == 0
				continue
			head = new TableHeader(head)
			head.on('click', @_headerClick)
	_headerClick:(e, value)=>
		@update({'sort': value})

	update:(values)->
		if !@_update
			return
		@_service?.cancel()
		for k, v of values
			switch k
				when 'search'
					delete @_values['page']
				when 'sort'
					if @_values['sort'] && @_values['sort'] == v
						v = '-' + v
			@_values[k] = v

		app.serviceController.setURLParams(@_values)
		@_service = app.serviceController.call({url: @_update, onComplete: @_dataLoaded, data: @_values}, false)
	_dataLoaded:(e, data)=>
		@element.templateNode.find('tbody')?.update(data.items, data.items)

	class TableHeader extends BaseDOM
		constructor:(el)->
			super({element: el})

			@css({cursor: 'pointer'})
			@_icon = new BaseDOM({element: 'i', className: 'sort-icon'})
			@appendChild(@_icon)
			@element.on('click', @_click)
			@_value = @attr('sort')
		_click:()=>
			@trigger('click', @_value)