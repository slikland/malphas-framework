#namespace components

class Input extends BaseDOM
	@SELECTOR: 'input,select,textarea'
	constructor:()->
		super
		@_checkAttributes()
		@element.on('focus', @_focus)
		@element.on('blur', @_blur)
		@element.on('change', @_update)
		@element.on('keydown', @_update)
		@element.on('keyup', @_update)

		if @element.tagName.toLowerCase() == 'textarea'
			if @attr('value')
				@text = @attr('value')

	destroy:()->

	_rebuildAsTextarea:()=>
		element = document.createElement('textarea')
		attrs = @element.attributes
		i = attrs.length
		while i-- > 0
			element.setAttribute(attrs[i].name, attrs[i].value)
		element.innerHTML = @_element.value
		@_element.parentNode.insertBefore(element, @_element)
		@_element.parentNode.removeChild(@_element)
		@_element = element
		@_element.__instance__ = @

	_checkAttributes:()->
		if @attr('type') == 'textarea'
			@_rebuildAsTextarea()
		if @attr('maxlength')
			@_maxLength = Number(@attr('maxlength'))
			@_charCounter = new CharCounter(@_maxLength)
			@element.parentNode.appendChild(@_charCounter)
		if @attr('restrict')
			@_restrict = new Restrict(@attr('restrict'))
	showError:(error)->
		@findParents('field')?.getInstance()?.showError(error)
		@addClass('error')

	clearError:()->
		@removeClass('error')

	_focus:()=>
		if @_charCounter
			@_charCounter.show()
		@findParents('field')?.getInstance()?.addClass('focused')
		@_update()

	_update:()=>
		@_restrict?.update(@element)
		value = @element.value
		@_charCounter?.update(value.length)

	_blur:()=>
		@findParents('field')?.getInstance()?.removeClass('focused')
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
	class Restrict
		constructor:(@_restrict)->
			@_re = new RegExp('[^' + @_restrict + ']', 'g')
		update:(target)->
			if target instanceof BaseDOM
				target = target.element
			else if !target instanceof HTMLElement
				throw new Error('Not an HTMLElement')
			initValue = target.value
			value = initValue.replace(@_re, '')
			if value != initValue
				p = target.selectionStart
				target.value = value
				target.setSelectionRange(p, p)
