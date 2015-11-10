class components.standalone.Cloneable extends StandaloneBase
	@SELECTOR: '[clonable]'
	constructor:(params)->
		@_added = false
		@_lastTop = 0
		@_target = params.element.element || params.element
		if !@_target
			throw new Error('No target element for cloneable')
		super({element: 'span'})
		@addClass('repeater')
		@_target.parentNode.insertBefore(@element, @_target)
		Resizer.getInstance().on('resize', @_resize)
		@_resize()
		@element.on('click', @_click)
	_resize:()=>
		bounds = @getBounds(@_target)
		@css({
			top: @_lastTop - bounds.top + 'px'
		})
		@_lastTop -= bounds.top
	
	_click:()=>
		if @_added
			@_remove()
		else
			@_clone()
		@_added = true
		@addClass('remove')
	_remove:()->
		@_target.parentNode.removeChild(@_target)
		@element.parentNode.removeChild(@element)
		@destroy()
		Resizer.getInstance().trigger('resize')

	_clone:()->
		parent = @_target.parentNode
		children = parent.childNodes
		i = children.length
		while i-- > 0
			if children[i] == @_target
				i++
				break
		last = false
		if children.length <= i
			last = true
		tempDiv = document.createElement('div')
		@_target.templateNode.render(tempDiv)
		for child in tempDiv.childNodes
			if last
				parent.appendChild(child)
			else
				parent.insertBefore(child, parent.childNodes[i++])
		Resizer.getInstance().trigger('resize')

	destroy:()->
		super
		Resizer.getInstance().off('resize', @_resize)
		@element.off('click', @_click)
