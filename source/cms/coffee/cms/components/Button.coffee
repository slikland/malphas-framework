#namespace components

class Button extends BaseDOM
	@SELECTOR: 'button'
	@ORDER: 0
	constructor:()->
		super
		console.log(@element)
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
		if e.metaKey?
			return
		if !@_enabled
			e.preventDefault()
			e.stopPropagation()
		if @attr('confirm')
			if !confirm(@attr('confirm'))
				e.stopPropagation()
				e.preventDefault()
				return
