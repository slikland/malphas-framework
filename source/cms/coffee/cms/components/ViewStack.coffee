class components.ViewStack extends BaseDOM
	@SELECTOR: 'viewstack'
	constructor:()->
		super
		@_parseViews(@findAll('view'))
		@select(@attr('selected'))
	destroy:()->
		@_select?.element?.off('change', @_selectChange)

	_parseViews:(views)->
		@_select = new BaseDOM({element: 'select'})
		@_select.attr('name', @attr('name'))
		@_select.element.on('change', @_selectChange)
		i = -1
		@_views = []
		for view in views
			i++
			viewData = {element: view}
			if !view.getAttribute('name')?
				view.setAttribute('name', i.toString()) 
			if !view.getAttribute('value')?
				view.setAttribute('value', i.toString())
			viewData['name'] = view.getAttribute('name')
			viewData['value'] = view.getAttribute('value')

			option = new BaseDOM({element: 'option'})
			option.html = viewData.name
			option.attr('value', viewData.value)
			viewData['option'] = option
			@_select.appendChild(option)

			@_views.push(viewData)

		@appendChild(@_select)

	_selectChange:(e)=>
		@select(@_select.element.value)
	select:(id = null)->
		firstView = null
		selectedView = null
		for view in @_views
			firstView ?= view
			if view.value == id
				selectedView = view
				view.option.element.setAttribute('selected', 'selected')
				try
					@appendChild(view.element)
			else
				view.option.element.removeAttribute('selected')
				try
					@removeChild(view.element)
		if !selectedView && firstView?
			@select(firstView.value)
