class components.Range extends BaseDOM
	@SELECTOR: 'input.rangeInput'
	@ORDER: 0
	constructor:()->
		super
		console.log(123)
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
			@_target.style[@_cssAttribute] = @element.value + 'px'

	_checkAttributes:()->
		console.log "asdasdasdas"