#namespace components

class ActionButton extends BaseDOM
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
	_click:(e)=>
		if !@_enabled
			e.preventDefault()
			e.stopPropagation()
			return
		if @attr('confirm')
			if !confirm(@attr('confirm'))
				e.stopPropagation()
				e.preventDefault()
				return
		app.serviceController.call({url: @attr('action')})
		e.stopPropagation()
		e.preventDefault()
