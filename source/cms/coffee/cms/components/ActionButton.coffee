class components.ActionButton extends BaseDOM
	@SELECTOR: 'button[action]'
	@ORDER: 0
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
	_click:()=>
		super
		if !@_enabled
			e.preventDefault()
			e.stopPropagation()
			return
		app.serviceController.call({url: @attr('action')})
