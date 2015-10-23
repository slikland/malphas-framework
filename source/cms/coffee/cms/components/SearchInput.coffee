class components.SearchInput extends BaseDOM
	@SELECTOR: 'input.search'
	@ORDER: 0
	constructor:()->
		super
		@_checkAttributes()
		@element.on('change', @_update)
		@element.on('keydown', @_update)
		@element.on('keyup', @_update)
	destroy:()->

	_checkAttributes:()->
		if @attr('maxlength')
			@_maxLength = Number(@attr('maxlength'))
			@_charCounter = new CharCounter(@_maxLength)
			@element.parentNode.appendChild(@_charCounter)

	_update:()=>
		value = @element.value.trim().toLowerCase()
		if value != @_value
			clearTimeout(@_updateTimeout)
			@_value = value
			@_updateTimeout = setTimeout(@_updateTarget, 300)
	_updateTarget:()=>
		if !@_target
			@_target = document.getElementById(@attr('for'))?.getInstance()
		
		if !@_target
			return
		@_target.update({'search': @_value})
