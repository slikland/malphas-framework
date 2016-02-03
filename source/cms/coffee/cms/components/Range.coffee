class components.Range extends BaseDOM
	@SELECTOR: '.rangeInput'
	@ORDER: 0
	constructor:()->
		super

		if @attr('cssAttribute')
			@_cssAttribute = @attr('cssAttribute')
		if @attr('for')
			@_target = app.body.find(@attr('for'))
			if @_target instanceof BaseDOM
				@_target = @_target.element

		@element.on('change', @_update)
	destroy:()->

	_update:()=>

		if @_target
			if @element.value == "left" || @element.value == "right"
				@_target.style[@_cssAttribute] = @element.value
			else
				@_target.style[@_cssAttribute] = @element.value + 'px'

	_checkAttributes:()->
		