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
		@_target.parentNode.insertBefore(@element, @_target)
		Resizer.getInstance().on('resize', @_resize)
		@_resize()
		@element.on('click', @_click)

	_resize:()=>
		bounds = @_target.getBoundingClientRect()
		parentBounds = @_target.parentNode.getBoundingClientRect()
		left = bounds.left - parentBounds.left
		top = bounds.top - parentBounds.top
		@css({
			top: top - 8 + 'px'
			left: (left + bounds.width) - 8 + 'px'
		})
	
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
