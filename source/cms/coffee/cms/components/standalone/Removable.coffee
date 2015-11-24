class components.standalone.Removable extends StandaloneBase
	@SELECTOR: '[removable]'
	constructor:(params)->
		@_added = false
		@_lastTop = -8
		@_lastLeft = 0
		@_target = params.element.element || params.element
		if !@_target
			throw new Error('No target element for removable')
		super({element: 'span'})
		@addClass('removable')

		@_inserted = false

		if ['input','textarea'].indexOf(@_target.tagName.toLowerCase()) >= 0
			@_target.parentNode.insertBefore(@element, @_target)
		else
			@_inserted = true
			@_target.appendChild(@element)
		Resizer.getInstance().on('resize', @_resize)
		@_resize()
		@element.on('click', @_click)

	_resize:()=>
		cssObj = {}
		if @_inserted
			cssObj['top'] = -8 + 'px'
			cssObj['right'] = - 8 + 'px'
		else
			bounds = @_target.getBoundingClientRect()
			parentBounds = @_target.parentNode.getBoundingClientRect()
			left = bounds.left - parentBounds.left
			top = bounds.top - parentBounds.top
			cssObj['top'] = top - 8 + 'px'
			cssObj['left'] = (left + bounds.width) - 8 + 'px'
		@css(cssObj)
	
	_click:()=>
		@_remove()

	_remove:()->
		@_target.parentNode.removeChild(@_target)
		@element.parentNode.removeChild(@element)
		@destroy()
		Resizer.getInstance().trigger('resize')

	destroy:()->
		super
		Resizer.getInstance().off('resize', @_resize)
		@element.off('click', @_click)
