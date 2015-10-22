class components.Input extends BaseDOM
	@SELECTOR: 'input,select,textarea'
	constructor:()->
		super
		@_checkAttributes()
		@element.on('focus', @_focus)
		@element.on('blur', @_blur)
	destroy:()->

	_checkAttributes:()->
		if @attr('maxlength')
			@_maxLength = Number(@attr('maxlength'))
			@_charCounter = new CharCounter(@_maxLength)
			@element.parentNode.appendChild(@_charCounter)


	_focus:()=>
		if @_charCounter
			@_charCounter.show()
			@_charCounter.update(10)

	_blur:()=>


	class CharCounter extends BaseDOM
		constructor:(@_maxLength)->
			super({element: 'span', className: 'hidden'})
			@css({
				position: 'absolute'
				right: '0px'
				top: '0px'
			})
		update:(@_currentLength)->
			@text = @_currentLength
		show:()->
			@removeClass('hidden')
			@addClass('show-up')
		hide:()->
			@addClass('hidden')
