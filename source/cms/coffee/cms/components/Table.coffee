#namespace components

class Table extends BaseDOM
	@SELECTOR: 'table'
	constructor:()->
		super
		@_values = app.serviceController?.getURLParams() || {}
		@_parseHeader()
		@_update = @attr('update')
		@_templateNode = @element.templateNode
		if @_templateNode?
			@_updateTargets(@_templateNode.data)
	destroy:()->
		@removeAll()
		@off()
		
	_parseHeader:()=>
		@_headers = []
		heads = @findAll('thead th')
		i = heads.length
		while i-- > 0
			head = heads[i]
			sort = head.getAttribute('sort')
			if !sort || sort.length == 0
				continue
			head = new TableHeader(head)
			head.on('click', @_headerClick)
			@_headers.push(head)
	_headerClick:(e, value)=>
		@update({'sort': value})

	update:(values)->
		if !@_update
			return
		@_service?.cancel()
		for k, v of values
			switch k
				when 'search'
					delete @_values['_index']
				when 'sort'
					if @_values['sort'] && @_values['sort'] == v
						v = '-' + v
			@_values[k] = v

		app.serviceController.setURLParams(@_values)
		@_service = app.serviceController.call({url: @_update, onComplete: @_dataLoaded, data: @_values}, false)
	_dataLoaded:(e, data)=>
		@element.templateNode.find('tbody')?.update(data.items, data.items)
		@_updateTargets(data)
	_updateHeader:(sort)->
		o = /^(\-?)(.*?)$/.exec(sort)
		d = 1
		if o[1]?.length > 0
			d *= -1
		for header in @_headers
			dir = 0
			if o[2] == header.value
				dir = d
			header.update(dir)
	_updateTargets:(data)->
		targets = document.querySelectorAll('[for="'+@attr('id')+'"]')

		@_updateHeader(@_values['sort'])

		for target in targets
			target.getInstance()?.update?(data, @_values)

	class TableHeader extends BaseDOM
		constructor:(el)->
			super({element: el})

			@css({cursor: 'pointer'})
			@_icon = new BaseDOM({element: 'i', className: 'sort-icon'})
			@appendChild(@_icon)
			@element.on('click', @_click)
			@_value = @attr('sort')
			@_direction = 0
		@get value:()->
			return @_value
		update:(direction = 0)->
			if direction == 1
				@_icon.addClass('down')
				@_icon.removeClass('up')
			else if direction == -1
				@_icon.addClass('up')
				@_icon.removeClass('down')
			else
				@_icon.removeClass('down')
				@_icon.removeClass('up')
			@_direction = direction
		_click:()=>
			@trigger('click', @_value)