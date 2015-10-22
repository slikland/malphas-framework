class components.Input extends BaseDOM
	@SELECTOR: 'input,select,textarea'
	constructor:()->
		super
		@_checkAttributes()
		@element.on('focus', @_focus)
		@element.on('blur', @_blur)
		@element.on('change', @_update)
		@element.on('keydown', @_update)
		@element.on('keyup', @_update)
	destroy:()->

	_checkAttributes:()->
		if @attr('maxlength')
			@_maxLength = Number(@attr('maxlength'))
			@_charCounter = new CharCounter(@_maxLength)
			@element.parentNode.appendChild(@_charCounter)


	_focus:()=>
		if @_charCounter
			@_charCounter.show()
		@_update()

	_update:()=>
		value = @element.value
		@_charCounter?.update(value.length)

	_blur:()=>
		@_charCounter?.hide()


	class CharCounter extends BaseDOM
		constructor:(@_maxLength)->
			super({element: 'span', className: 'charCounter hidden'})
			@css({
				position: 'absolute'
				right: '0px'
				top: '0px'
			})
		update:(@_currentLength)->
			@text = @_maxLength - @_currentLength
		show:()->
			@removeClass('hidden')
			@addClass('show-up')
			@removeClass('hide-up')
		hide:()->
			@addClass('hide-up')
			@removeClass('show-up')
