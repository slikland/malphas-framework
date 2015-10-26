class components.Button extends BaseDOM
	@SELECTOR: 'button'
	constructor:()->
		super
		@_enabled = true
		@element.on('click', @_click)
	destroy:()->
		@removeAll()
		@off()
		@element.off('click', @_click)

	enable:(enabled = true)->
		if enabled
			@removeClass('disabled')
		else
			@addClass('disabled')

		@_enabled = enabled
	_click:(e)=>
		if !@_enabled
			e.preventDefault()
			e.stopPropagation()
		
